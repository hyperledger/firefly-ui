// Copyright © 2021 Kaleido, Inc.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import useModuleTranslation from '../../../core/hooks/useModuleTranslation';
import i18n from 'i18next';
import enData from './en.json';

const DATA_TRANSLATIONS_NS = 'data';

export const registerDataTranslations = (): void => {
  i18n.addResourceBundle('en', DATA_TRANSLATIONS_NS, enData);
};

export const useDataTranslation = (): { t: (key: string) => string } => {
  return useModuleTranslation(DATA_TRANSLATIONS_NS);
};
