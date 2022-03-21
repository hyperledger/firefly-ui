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

import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { Timeline } from '@mui/lab';
import { Fab, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ITimelineElement } from '../../interfaces';
import { DEFAULT_TIMELINE_HEIGHT } from '../../theme';
import { EmptyStateCard } from '../Cards/EmptyStateCard';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { TimelineItemWrapper } from './TimelineItemWrapper';

interface Props {
  elements: ITimelineElement[] | undefined;
  emptyText: string;
  fetchMoreData: any;
  hasMoreData: boolean | undefined;
  height?: string | number;
  fetchNewData: any;
  numNewEvents: number;
}

export const FFTimeline: React.FC<Props> = ({
  elements,
  emptyText,
  fetchMoreData,
  hasMoreData = false,
  height,
  fetchNewData,
  numNewEvents,
}) => {
  const { t } = useTranslation();
  const myRef: any = useRef(null);

  useEffect(() => {
    if (numNewEvents === 0 && myRef?.current) {
      myRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [numNewEvents]);

  return (
    <Paper
      sx={{
        width: '100%',
        height: height ?? DEFAULT_TIMELINE_HEIGHT,
        backgroundColor: 'background.paper',
        overflow: 'auto',
      }}
      elevation={0}
    >
      {!elements ? (
        <FFCircleLoader height="100%" color="warning"></FFCircleLoader>
      ) : elements.length === 0 ? (
        <EmptyStateCard text={emptyText}></EmptyStateCard>
      ) : (
        <>
          <Grid
            container
            justifyContent="center"
            style={{
              backgroundColor: 'transparent',
              boxShadow: 'none',
              position: 'relative',
            }}
          >
            {numNewEvents > 0 && (
              <Grid item py={1} sx={{ position: 'absolute', zIndex: 1000 }}>
                <Fab
                  size="small"
                  color="info"
                  variant="extended"
                  onClick={fetchNewData}
                >
                  <ArrowCircleUpIcon sx={{ mr: 1 }} />
                  {`${t('see')} ${numNewEvents} ${t('newEvents')}`}
                </Fab>
              </Grid>
            )}
          </Grid>

          <div id="scrollableDiv" style={{ height: '100%', overflow: 'auto' }}>
            <Timeline
              sx={{
                paddingLeft: '15%',
                paddingRight: '15%',
                marginTop: 0,
                paddingTop: 0,
              }}
            >
              {elements && (
                <InfiniteScroll
                  dataLength={elements.length}
                  next={fetchMoreData}
                  hasMore={hasMoreData}
                  scrollableTarget="scrollableDiv"
                  loader={<FFCircleLoader color="warning" />}
                  endMessage={
                    <Grid
                      container
                      pt={3}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Typography sx={{ fontSize: '14px' }}>
                        {t('noMoreEvents')}
                      </Typography>
                    </Grid>
                  }
                >
                  {elements.map((element, idx) =>
                    idx === 0 ? (
                      <div key={idx} ref={myRef} className="scrollToHere">
                        <TimelineItemWrapper
                          {...{ element }}
                          opposite={element.opposite}
                        />
                      </div>
                    ) : (
                      <TimelineItemWrapper
                        key={idx}
                        {...{ element }}
                        opposite={element.opposite}
                      />
                    )
                  )}
                </InfiniteScroll>
              )}
            </Timeline>
          </div>
        </>
      )}
    </Paper>
  );
};
