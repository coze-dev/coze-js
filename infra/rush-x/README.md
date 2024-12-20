# @coze-infra/rush-x

## Introduction

Toolkit for integrating Rush monorepo, can work with CI to complete automation.

## Detail
Please run `node infra/rush-x/bin/run --help` to get more information.

## Commands

### `publish`

Command for publishing package versions, supporting various publishing strategies and version upgrade methods.

```bash
rush-x publish [options]
```

#### Options

- `-v, --version <version>`: Specify the version number to publish
- `-b, --bump-type <type>`: Version upgrade type, supports the following options:
  - `alpha`: Alpha pre-release version (e.g., 1.0.0-alpha.abc123)
  - `beta`: Beta pre-release version (e.g., 1.0.0-beta.1)
  - `patch`: Patch version for bug fixes (e.g., 1.0.0 -> 1.0.1)
  - `minor`: Minor version for new features (e.g., 1.0.0 -> 1.1.0)
  - `major`: Major version for breaking changes (e.g., 1.0.0 -> 2.0.0)
- `-t, --to <packages...>`: Publish specified packages and their downstream dependencies
- `-f, --from <packages...>`: Publish specified packages and their upstream/downstream dependencies
- `-o, --only <packages...>`: Publish only the specified packages
- `-d, --dry-run`: Test run mode without actual execution
- `-s, --skip-commit`: Skip Git commit step

### Publishing Process

1. **Select Publishing Scope**
   - Use `--to` to publish specified packages and their downstream dependencies
   - Use `--from` to publish specified packages and their upstream/downstream dependencies
   - Use `--only` to publish only the specified packages

2. **Version Upgrade**
   - Specify version: Use `--version` parameter
   - Specify upgrade type: Use `--bump-type` parameter
   - Interactive selection: When neither parameter is specified, prompts for upgrade type

3. **Confirm Publication**
   - Display packages to be published and version changes
   - Request user confirmation to proceed

4. **Execute Publication**
   - Update version numbers in package.json
   - Generate changelog
   - Create release branch
   - Commit changes to Git

#### Examples

```bash
# Publish a single package
rush-x publish --only @scope/package-name

# Publish package and its downstream dependencies
rush-x publish --to @scope/package-name

# Publish with specific version
rush-x publish --only @scope/package-name --version 1.0.0

# Publish beta version
rush-x publish --only @scope/package-name --bump-type beta

# Dry run mode
rush-x publish --only @scope/package-name --dry-run
```

#### Notes

1. Ensure the command is executed in the Rush monorepo root directory
2. Requires appropriate Git permissions for branch creation and commits
3. Changelog generation is skipped for pre-release versions (alpha/beta)
4. Package publish configuration (shouldPublish) is automatically verified before publishing
5. The command will modify files, and create new branches, but **you need to push the branch to remote repository manually, and then create a pull request**.
