const pkgConf = require('pkg-conf');
const findUp = require('find-up');
const path = require('path');
const resolve = require('resolve');

const structureDependencies = (dependencies, dependencyPath) => (
  Object.keys(dependencies).map(dependency => (
    {
      basedir: dependencyPath,
      name: dependency,
    }
  ))
);

const getCoreDependencies = () => {
  const packageJsonPath = findUp.sync('package.json', { cwd: __dirname });
  const coreDirectory = !packageJsonPath ? false : path.dirname(packageJsonPath);

  const devDependencies = pkgConf.sync('devDependencies', { cwd: coreDirectory });
  const dependencies = pkgConf.sync('dependencies', { cwd: coreDirectory });

  const coreDependencies = Object.assign(devDependencies, dependencies);

  return structureDependencies(coreDependencies, coreDirectory);
};

const filterAndSetupDependencies = (dependencyPath, object, keyword, setupFunction) => {
  const dependencyPackageJsonPath = findUp.sync('package.json', { cwd: dependencyPath });
  const dependencyPackageJson = require(dependencyPackageJsonPath);
  const keywords = dependencyPackageJson.keywords || [];

  if (keywords.includes(keyword)) {
    const extensionPath = path.dirname(dependencyPackageJsonPath);
    const extension = require(extensionPath);

    // why the dependencyPath?
    if (typeof extension[setupFunction] === 'function') {
      extension[setupFunction](keyword, object, dependencyPath);
    }
  }
};

const setupDependencies = (keyword, object, setupFunction = 'register') => {
  const devDependencies = pkgConf.sync('devDependencies');
  const devDependenciesWithPath = structureDependencies(devDependencies, global.APP_ROOT_PATH);

  const coreDependenciesWithPath = getCoreDependencies();

  const allDependencies = [
    ...coreDependenciesWithPath,
    ...devDependenciesWithPath,
  ];

  allDependencies.forEach(dependency => {
    const { basedir, name } = dependency;

    try {
      const dependencyPath = resolve.sync(name, { basedir });

      filterAndSetupDependencies(dependencyPath, object, keyword, setupFunction);
    } catch (error) {
      console.log(`Error trying to resolve dependency ${name}. Continuing...`);
    }
  });
};

module.exports = setupDependencies;
