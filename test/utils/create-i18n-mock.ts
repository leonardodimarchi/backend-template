import { I18nContext } from "nestjs-i18n";
import { DeepMocked, createMock } from "./create-mock";
import { I18nTranslations } from "src/generated/i18n.generated";

export function createI18nMock(): DeepMocked<I18nContext<I18nTranslations>> {
  return createMock<I18nContext<I18nTranslations>>();
}