// #region Imports

import { mkdir, readFile, writeFile } from 'fs';
import { Command, CommandRunner } from 'nest-commander';
import { paramCase as kebabCase } from 'param-case';
import { pascalCase } from 'pascal-case';
import { join } from 'path';
import { plural, singular } from 'pluralize';
import { promisify } from 'util';

// #endregion

@Command({
  name: 'generate',
  aliases: ['g'],
  arguments: '<module>',
  description:
    'Generates a new module at src/modules with a base folder structure and common files',
})
export class GenerateModuleService extends CommandRunner {
  async run([moduleName]: string[]): Promise<void> {
    console.log('\nDomain\n');
    await this.createDomain(moduleName);
    console.log('\nInfrastructure\n');
    await this.createInfra(moduleName);
    console.log('\nPresenter\n');
    await this.createPresenter(moduleName);
    console.log('\nModule\n');
    await this.createModule(moduleName);
    console.log('\nTest Related\n');
    await this.createTestRelated(moduleName);
  }

  public async createDomain(name: string): Promise<void> {
    await this.createTemplate({
      baseName: name,
      folder: 'domain/entities',
      extension: 'entity',
      templateName: 'templates/domain/entities/resource.entity',
      logName: 'uma entidade',
    });

    await this.createTemplate({
      baseName: name,
      folder: 'domain/repositories',
      extension: 'repository',
      templateName: 'templates/domain/repositories/resource.repository',
      logName: 'uma interface de repositório',
    });

    await this.createTemplate({
      baseName: name,
      folder: 'domain/usecases/create',
      prefixFilename: 'create',
      extension: 'usecase',
      templateName: 'templates/domain/usecases/create/create-resource.usecase',
      logName: 'um caso de uso de criação',
    });

    await this.createTemplate({
      baseName: name,
      folder: 'domain/usecases/create',
      prefixFilename: 'create',
      extension: 'usecase.test',
      templateName:
        'templates/domain/usecases/create/create-resource.usecase.test',
      logName: 'o arquivo de teste do caso de uso de criação',
    });

    await this.createTemplate({
      baseName: name,
      folder: 'domain/usecases/get-all',
      prefixFilename: 'get-all',
      extension: 'usecase',
      templateName:
        'templates/domain/usecases/get-all/get-all-resource.usecase',
      logName: 'um caso de uso de buscar os dados',
    });

    await this.createTemplate({
      baseName: name,
      folder: 'domain/usecases/get-all',
      prefixFilename: 'get-all',
      extension: 'usecase.test',
      templateName:
        'templates/domain/usecases/get-all/get-all-resource.usecase.test',
      logName: 'o arquivo de teste do caso de uso de buscar os dados',
    });
  }

  public async createInfra(name: string): Promise<void> {
    await this.createTemplate({
      baseName: name,
      folder: 'infra/database',
      suffixFileName: 'database',
      extension: 'module',
      templateName: 'templates/infra/database/resource-database.module',
      logName: 'um módulo para o banco de dados',
    });

    await this.createTemplate({
      baseName: name,
      folder: 'infra/database/typeorm/mappers',
      suffixFileName: 'typeorm',
      extension: 'mapper',
      templateName:
        'templates/infra/database/typeorm/mappers/resource-typeorm.mapper',
      logName: 'um mapper do typeorm',
    });

    await this.createTemplate({
      baseName: name,
      folder: 'infra/database/typeorm/repositories',
      suffixFileName: 'typeorm',
      extension: 'repository',
      templateName:
        'templates/infra/database/typeorm/repositories/resource-typeorm.repository',
      logName: 'um repositorio do typeorm',
    });

    await this.createTemplate({
      baseName: name,
      folder: 'infra/database/typeorm/schemas',
      extension: 'schema',
      templateName: 'templates/infra/database/typeorm/schemas/resource.schema',
      logName: 'um schema do typeorm',
    });
  }

  public async createPresenter(name: string): Promise<void> {
    await this.createTemplate({
      baseName: name,
      folder: 'presenter/controllers',
      extension: 'controller',
      templateName: 'templates/presenter/controllers/resource.controller',
      logName: 'um controller',
    });

    await this.createTemplate({
      baseName: name,
      folder: 'presenter/controllers',
      extension: 'controller.test',
      templateName: 'templates/presenter/controllers/resource.controller.test',
      logName: 'o arquivo de teste para o controller',
    });

    await this.createTemplate({
      baseName: name,
      folder: 'presenter/models/payloads',
      suffixFileName: 'create',
      extension: 'payload',
      templateName:
        'templates/presenter/models/payloads/resource-create.payload',
      logName: 'um payload de criação',
    });

    await this.createTemplate({
      baseName: name,
      folder: 'presenter/models/view-models',
      extension: 'view-model',
      templateName:
        'templates/presenter/models/view-models/resource.view-model',
      logName: 'um view-model',
    });
  }

  public async createModule(name: string): Promise<void> {
    await this.createTemplate({
      baseName: name,
      folder: '',
      extension: 'module',
      templateName: 'templates/resource.module',
      logName: 'um módulo',
    });
  }

  public async createTestRelated(name: string): Promise<void> {
    await this.createTemplate({
      baseName: name,
      folder: '../../../test/factories',
      suffixFileName: 'mock',
      templateName: 'test-templates/factories/resource-mock',
      logName: 'uma mock factory',
    });

    await this.createTemplate({
      baseName: name,
      folder: '../../../test/repositories',
      suffixFileName: 'in-memory-repository',
      templateName: 'test-templates/repositories/resource-in-memory-repository',
      logName: 'um repositório em memória',
    });
  }

  // #endregion

  // #region Private Methods

  private async createTemplate({
    baseName,
    folder,
    extension,
    templateName,
    logName,
    prefixFilename,
    suffixFileName,
  }: CreateTemplateOptions): Promise<void> {
    const entityName = this.formatEntityName(baseName);

    const entityDisplayName = this.formatEntityDisplayName(baseName);

    const entityDatabaseTableName = this.formatDatabaseTableName(baseName);

    const entityControllerPrefixName =
      this.formatControllerPrefixName(baseName);

    const entityControllerDisplayName =
      this.formatControllerDisplayName(baseName);

    const fileName = `${
      prefixFilename ? prefixFilename + '-' : ''
    }${entityName}${suffixFileName ? '-' + suffixFileName : ''}${
      extension ? '.' + extension : ''
    }.ts`;
    const dirPath = join(__dirname, '../modules', entityName, folder);
    const filePath = join(dirPath, fileName);

    console.log(`Criando ${logName}...`);

    try {
      const templateFilePath = join(__dirname, `${templateName}.template`);

      const templateContent = await promisify(readFile)(templateFilePath).then(
        (buffer) => buffer.toString('utf8'),
      );

      const fileContent = templateContent
        .replace(/\$EntityDatabaseTableName\$/g, entityDatabaseTableName)
        .replace(/\$EntityControllerPrefixName\$/g, entityControllerPrefixName)
        .replace(
          /\$EntityControllerDisplayName\$/g,
          entityControllerDisplayName,
        )
        .replace(/\$EntityName\$/g, entityDisplayName)
        .replace(/\$EntityPluralName\$/g, plural(entityDisplayName));

      await promisify(mkdir)(dirPath, { recursive: true });
      await promisify(writeFile)(filePath, fileContent);
    } catch (e) {
      console.error(`Ocorreu um erro ao criar o ${logName}: ${e.message}\n`);
    }
  }

  /**
   * @example
   * Input: 'asset-forms-fields'
   * Output: 'asset-form-field'
   *
   * @returns the entity name in kebab case and singular
   */
  private formatEntityName(name: string): string {
    const entityKebabCase = kebabCase(name);
    const entityKebabCaseAndSingular = entityKebabCase
      .split('-')
      .map((name) => singular(name))
      .join('-');

    return entityKebabCaseAndSingular;
  }

  /**
   * @example
   * Input: 'asset-forms-fields'
   * Output: 'AssetFormField'
   *
   * @returns the entity name in pascal case and singular
   */
  private formatEntityDisplayName(name: string): string {
    const entityKebabCase = kebabCase(name);
    const entityKebabCaseAndSingular = entityKebabCase
      .split('-')
      .map((name) => singular(name))
      .join('-');

    return pascalCase(entityKebabCaseAndSingular);
  }

  /**
   * @example
   * Input: 'asset-forms-fields'
   * Output: 'asset_form_fields'
   *
   * Input: 'asset-form-field'
   * Output: 'asset_form_fields'
   *
   * @returns the entity name in kebab case, with the last word in plural and joined by "_"
   */
  private formatDatabaseTableName(name: string): string {
    const kebabParts = kebabCase(name).split('-');
    const kebabPartsInSingular = kebabParts.map((name) => singular(name));

    const lastPart = kebabPartsInSingular.pop();

    if (!lastPart) {
      throw new Error(
        'Ocorreu um problema ao montar o nome da tabela referente a essa entidade.',
      );
    }

    const pluralLastPart = plural(lastPart);

    kebabPartsInSingular.push(pluralLastPart);

    return kebabPartsInSingular.join('_');
  }

  /**
   * @example
   * Input: 'asset-forms-fields'
   * Output: 'asset-form-fields'
   *
   * Input: 'asset-form-field'
   * Output: 'asset-form-fields'
   *
   * @returns the entity name in kebab case, with the last word in plural and joined by "-"
   */
  private formatControllerPrefixName(name: string): string {
    const kebabParts = kebabCase(name).split('-');
    const kebabPartsInSingular = kebabParts.map((name) => singular(name));

    const lastPart = kebabPartsInSingular.pop();

    if (!lastPart) {
      throw new Error(
        'Ocorreu um problema ao montar o prefixo do controller referente a essa entidade.',
      );
    }

    const pluralLastPart = plural(lastPart);

    kebabPartsInSingular.push(pluralLastPart);

    return kebabPartsInSingular.join('-');
  }

  /**
   * @example
   * Input: 'asset-forms-fields'
   * Output: 'Asset Form Fields'
   *
   * Input: 'asset-form-field'
   * Output: 'Asset Form Fields'
   *
   * @returns the entity name in spaced pascal case
   */
  private formatControllerDisplayName(name: string): string {
    const kebabParts = kebabCase(name).split('-');
    const kebabPartsInSingular = kebabParts.map((name) => singular(name));

    const lastPart = kebabPartsInSingular.pop();

    if (!lastPart) {
      throw new Error(
        'Ocorreu um problema ao montar o nome de exibição do controller referente a essa entidade.',
      );
    }

    const pluralLastPart = plural(lastPart);

    kebabPartsInSingular.push(pluralLastPart);

    return kebabPartsInSingular.map((part) => pascalCase(part)).join(' ');
  }

  // #endregion
}

interface CreateTemplateOptions {
  baseName: string;
  folder: string;
  templateName: string;
  logName: string;
  extension?: string;
  prefixFilename?: string;
  suffixFileName?: string;
}
