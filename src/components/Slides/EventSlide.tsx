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
  FF_Paths,
  IData,
  IEvent,
  ITokenApproval,
  ITokenApprovalWithPoolName,
} from '../../interfaces';
import { DEFAULT_PADDING } from '../../theme';
import { fetchCatcher, fetchPool } from '../../utils';
import { BlockchainEventAccordion } from '../Accordions/BlockchainEventAccordion';
import { JsonViewAccordion } from '../Accordions/JsonViewerAccordion';
import { MessageAccordion } from '../Accordions/MessageAccordion';
import { MessageDataAccordion } from '../Accordions/MessageDataAccordion';
import { TransactionAccordion } from '../Accordions/TransactionAccordion';
import { ApiList } from '../Lists/ApiList';
import { ApprovalList } from '../Lists/ApprovalList';
import { EventList } from '../Lists/EventList';
import { IdentityList } from '../Lists/IdentityList';
import { InterfaceList } from '../Lists/InterfaceList';
import { NamespaceList } from '../Lists/NamespaceList';
import { PoolList } from '../Lists/PoolList';
import { TransferList } from '../Lists/TransferList';
import { TxList } from '../Lists/TxList';
import { DisplaySlide } from './DisplaySlide';
import { SlideHeader } from './SlideHeader';
import { SlideSectionHeader } from './SlideSectionHeader';
import { PoolContext } from '../../contexts/PoolContext';

interface Props {
  event: IEvent;
  open: boolean;
  onClose: () => void;
}

export const EventSlide: React.FC<Props> = ({ event, open, onClose }) => {
  const { t } = useTranslation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { poolCache, setPoolCache } = useContext(PoolContext);
  const [enrichedEvent, setEnrichedEvent] = useState<IEvent>();
  const [messageData, setMessageData] = useState<IData[]>();
  const { txID } = useParams<{ txID: string }>();
  const [approvalWithName, setApprovalWithName] =
    useState<ITokenApprovalWithPoolName>();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    // Enriched event
    isMounted &&
      FF_EVENTS_CATEGORY_MAP[event.type]?.enrichedEventKey &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.events}?reference=${event.reference}&fetchreferences=true&limit=1`
      )
        .then((events: IEvent[]) => {
          isMounted && setEnrichedEvent(events[0]);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [event, isMounted]);

  useEffect(() => {
    if (enrichedEvent && isMounted) {
      enrichedEvent['message'] &&
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.messageDataById(
            enrichedEvent['message']?.header.id
          )}?limit=25`
        )
          .then((data: IData[]) => {
            isMounted && setMessageData(data);
          })
          .catch((err) => {
            reportFetchError(err);
          });
    }
  }, [enrichedEvent, isMounted]);

  useEffect(() => {
    if (enrichedEvent && isMounted && enrichedEvent['tokenApproval']) {
      fetchPoolName(enrichedEvent.tokenApproval).then(
        (approvalWithName: ITokenApprovalWithPoolName) => {
          setApprovalWithName(approvalWithName);
        }
      );
    }
  }, [enrichedEvent, isMounted]);

  const fetchPoolName = async (
    approval: ITokenApproval
  ): Promise<ITokenApprovalWithPoolName> => {
    const pool = await fetchPool(
      selectedNamespace,
      approval.pool,
      poolCache,
      setPoolCache
    );
    return {
      ...approval,
      poolName: pool ? pool.name : approval.pool,
    };
  };

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
          {enrichedEvent && enrichedEvent['blockchainEvent'] && (
            <>
              <SlideSectionHeader title={t('blockchainEvent')} />
              <Grid container item>
                <BlockchainEventAccordion
                  isOpen
                  be={enrichedEvent.blockchainEvent}
                />
              </Grid>
            </>
          )}
          {/* Contract API */}
          {enrichedEvent && enrichedEvent['contractAPI'] && (
            <>
              <SlideSectionHeader title={t('contractAPI')} />
              <Grid container item>
                <ApiList api={enrichedEvent.contractAPI} />
              </Grid>
            </>
          )}
          {/* Contract Interface */}
          {enrichedEvent && enrichedEvent['contractInterface'] && (
            <>
              <SlideSectionHeader title={t('contractInterface')} />
              <Grid container item>
                <InterfaceList cInterface={enrichedEvent.contractInterface} />
              </Grid>
            </>
          )}
          {/* Datatype */}
          {enrichedEvent && enrichedEvent['datatype'] && (
            <>
              <SlideSectionHeader title={t('datatype')} />
              <Grid container item pb={DEFAULT_PADDING}>
                <JsonViewAccordion
                  isOpen
                  header={t('value')}
                  json={enrichedEvent.datatype.value}
                />
              </Grid>
            </>
          )}
          {/* Identity */}
          {enrichedEvent && enrichedEvent['identity'] && (
            <>
              <SlideSectionHeader title={t('identity')} />
              <Grid container item>
                <IdentityList identity={enrichedEvent.identity} />
              </Grid>
            </>
          )}
          {/* Message */}
          {enrichedEvent && enrichedEvent['message'] && (
            <>
              <SlideSectionHeader title={t('message')} />
              <Grid container item>
                <MessageAccordion message={enrichedEvent.message} />
              </Grid>
            </>
          )}
          {/* Message Data */}
          {messageData && messageData.length > 0 && (
            <>
              <SlideSectionHeader title={t('messageData')} />
              <Grid container item>
                {messageData?.map((data, idx) => (
                  <MessageDataAccordion isOpen key={idx} data={data} />
                ))}
              </Grid>
            </>
          )}
          {/* Namespace */}
          {enrichedEvent && enrichedEvent['namespaceDetails'] && (
            <>
              <SlideSectionHeader title={t('namespaceDetails')} />
              <Grid container item>
                <NamespaceList ns={enrichedEvent.namespaceDetails} />
              </Grid>
            </>
          )}
          {/* Token Approval */}
          {enrichedEvent && enrichedEvent['tokenApproval'] && (
            <>
              <SlideSectionHeader title={t('tokenApproval')} />
              <Grid container item>
                <ApprovalList approval={approvalWithName} />
              </Grid>
            </>
          )}
          {/* Token Pool */}
          {enrichedEvent && enrichedEvent['tokenPool'] && (
            <>
              <SlideSectionHeader title={t('tokenPool')} />
              <Grid container item>
                <PoolList pool={enrichedEvent.tokenPool} />
              </Grid>
            </>
          )}
          {/* Transaction */}
          {enrichedEvent && enrichedEvent['transaction'] && (
            <>
              <SlideSectionHeader title={t('transaction')} />
              <Grid container item>
                <TxList tx={enrichedEvent.transaction} />
                <TransactionAccordion isOpen tx={enrichedEvent?.transaction} />
              </Grid>
            </>
          )}
          {/* Token Transfer */}
          {enrichedEvent && enrichedEvent['tokenTransfer'] && (
            <>
              <SlideSectionHeader
                title={`${t(
                  'tokenTransfer'
                )} - ${enrichedEvent.tokenTransfer.type.toUpperCase()}`}
              />
              <Grid container item>
                <TransferList transfer={enrichedEvent?.tokenTransfer} />
              </Grid>
            </>
          )}
        </Grid>
      </DisplaySlide>
    </>
  );
};
