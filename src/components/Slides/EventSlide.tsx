// Copyright © 2022 Kaleido, Inc.
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

import { Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import {
  FF_EVENTS_CATEGORY_MAP,
  FF_NAV_PATHS,
  FF_Paths,
  IData,
  IEvent,
} from '../../interfaces';
import { DEFAULT_PADDING } from '../../theme';
import { fetchCatcher } from '../../utils';
import { BlockchainEventAccordion } from '../Accordions/BlockchainEventAccordion';
import { MessageAccordion } from '../Accordions/MessageAccordion';
import { MessageDataAccordion } from '../Accordions/MessageDataAccordion';
import { TransactionAccordion } from '../Accordions/TransactionAccordion';
import { EventList } from '../Lists/EventList';
import { DisplaySlide } from './DisplaySlide';
import { SlideHeader } from './SlideHeader';
import { SlideSectionHeader } from './SlideSectionHeader';

interface Props {
  event: IEvent;
  open: boolean;
  onClose: () => void;
}

export const EventSlide: React.FC<Props> = ({ event, open, onClose }) => {
  const { t } = useTranslation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const [enrichedEvent, setEnrichedEvent] = useState<IEvent>();
  const [messageData, setMessageData] = useState<IData[]>();
  const { txID } = useParams<{ txID: string }>();

  useEffect(() => {
    // Enriched event
    FF_EVENTS_CATEGORY_MAP[event.type]?.enrichedEventKey &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.events}?reference=${event.reference}&fetchreferences=true&limit=1`
      )
        .then((events: IEvent[]) => {
          setEnrichedEvent(events[0]);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [event]);

  useEffect(() => {
    if (enrichedEvent) {
      enrichedEvent['message'] &&
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.messageDataById(
            enrichedEvent['message']?.header.id
          )}?limit=25`
        )
          .then((data: IData[]) => {
            setMessageData(data);
          })
          .catch((err) => {
            reportFetchError(err);
          });
    }
  }, [enrichedEvent]);

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Title */}
          <SlideHeader
            subtitle={t('event')}
            title={t(FF_EVENTS_CATEGORY_MAP[event.type]?.nicename)}
          />
          {/* Data list */}
          <Grid container item>
            <EventList event={event} showTxLink={txID !== event.tx} />
          </Grid>
          {/* Blockchain event */}
          {enrichedEvent && enrichedEvent['blockchainevent'] && (
            <>
              <SlideSectionHeader
                clickPath={FF_NAV_PATHS.blockchainEventsPath(
                  selectedNamespace,
                  event.tx
                )}
                title={t('blockchainEvent')}
              />
              <Grid container item>
                <BlockchainEventAccordion be={enrichedEvent?.blockchainevent} />
              </Grid>
            </>
          )}
          {/* Message */}
          {enrichedEvent && enrichedEvent['message'] && (
            <>
              <SlideSectionHeader
                clickPath={FF_NAV_PATHS.offchainMessagesPath(
                  selectedNamespace,
                  enrichedEvent.message.header.id
                )}
                title={t('message')}
              />
              <Grid container item>
                <MessageAccordion message={enrichedEvent?.message} />
              </Grid>
            </>
          )}
          {/* Message Data */}
          {messageData && messageData.length > 0 && (
            <>
              <SlideSectionHeader title={t('messageData')} />
              <Grid container item>
                {messageData?.map((data, idx) => (
                  <MessageDataAccordion key={idx} data={data} />
                ))}
              </Grid>
            </>
          )}
          {/* Transaction */}
          {enrichedEvent && enrichedEvent['transaction'] && (
            <>
              <SlideSectionHeader
                clickPath={FF_NAV_PATHS.activityTxDetailPath(
                  selectedNamespace,
                  enrichedEvent.transaction.id
                )}
                title={t('transaction')}
              />
              <Grid container item>
                <TransactionAccordion tx={enrichedEvent?.transaction} />
              </Grid>
            </>
          )}
        </Grid>
      </DisplaySlide>
    </>
  );
};
