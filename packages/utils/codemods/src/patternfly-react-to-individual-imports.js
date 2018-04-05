// TODO: Generate these based off packages here.
const componentPacakgeMap = {
  Button: '@dougmiller/button-lerna',
  ButtonGroup: '@dougmiller/button-lerna',
  Badge: '@dougmiller/badge-lerna',
  Alert: '@dougmiller/alert-lerna'
};

function findImportAfterPackage({ packageName, j, root }) {
  let target;
  let targetName;
  root.find(j.ImportDeclaration).forEach(path => {
    const name = path.value.source.value.toLowerCase();
    if (name > packageName && (!target || name < targetName)) {
      targetName = name;
      target = path;
    }
  });

  return target;
}

function getPackagesToAdd({ j, root }) {
  const map = {};
  root
    .find(j.ImportDeclaration, {
      source: { value: 'patternfly-react' }
    })
    .forEach(nodePath => {
      j(nodePath.value)
        .find(j.ImportSpecifier)
        .forEach(specifierPath => {
          const name = specifierPath.node.imported.name;
          const importName = componentPacakgeMap[name];
          if (importName) {
            if (!map[importName]) {
              map[importName] = [];
            }
            !map[importName].push(j.importSpecifier(j.identifier(name)));
          }
        });
    });
  return map;
}

function addImportSpecifiersForPacakge({ packageName, imports, j, root }) {
  const prevImport = root.find(j.ImportDeclaration, {
    source: { value: packageName }
  });

  if (prevImport.length) {
    prevImport.forEach(path => {
      imports.forEach(i => {
        const exists = !!path.node.specifiers.find(
          spec => spec.imported.name === i.imported.name
        );
        if (!exists) {
          hasModifications = true;
          path.node.specifiers.push(i);
        }
      });
    });
    return;
  }
  hasModifications = true;
  const targetPath = findImportAfterPackage({ packageName, j, root });
  const importStatement = j.importDeclaration(imports, j.literal(packageName));
  j(targetPath).insertBefore(importStatement);
}

function removeSpecifiersFromPatternflyReact({ specifiers, j, root }) {
  root
    .find(j.ImportDeclaration, {
      source: { value: 'patternfly-react' }
    })
    .find(j.Identifier)
    .filter(
      path =>
        specifiers.some(s => s.imported.name === path.node.name) &&
        path.parent.node.type === 'ImportSpecifier'
    )
    .forEach(path => {
      hasModifications = true;
      const importDeclaration = path.parent.parent.node;
      importDeclaration.specifiers = importDeclaration.specifiers.filter(
        specifier =>
          !specifier.imported ||
          !specifiers.some(s => s.imported.name === specifier.imported.name)
      );
    });
}

function removeEmptyPatternFlyReactImport({ j, root }) {
  root
    .find(j.ImportDeclaration)
    .filter(
      path =>
        path.node.specifiers.length === 0 &&
        path.node.source.value === 'patternfly-react'
    )
    .replaceWith();
}

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  let hasModifications = false;

  const packagesToAdd = getPackagesToAdd({ j, root });

  Object.keys(packagesToAdd).forEach(pkg => {
    addImportSpecifiersForPacakge({
      packageName: pkg,
      imports: packagesToAdd[pkg],
      j,
      root
    });
    removeSpecifiersFromPatternflyReact({
      specifiers: packagesToAdd[pkg],
      j,
      root
    });
  });

  if (hasModifications) {
    removeEmptyPatternFlyReactImport({ j, root });
  }

  return hasModifications
    ? root.toSource({
        quote: 'single'
      })
    : null;
};
