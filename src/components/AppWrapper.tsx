import { styled } from '@mui/material';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import {
  Navigate,
  Outlet,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import { ApplicationContext } from '../contexts/ApplicationContext';
import { DateFilterContext } from '../contexts/DateFilterContext';
import { FilterContext } from '../contexts/FilterContext';
import { SlideContext } from '../contexts/SlideContext';
import {
  ITimeFilterObject,
  NAMESPACES_PATH,
  TimeFilterEnum,
} from '../interfaces';
import { getTimeFilterObject } from '../utils';
import { Navigation, NAV_WIDTH } from './Navigation/Navigation';

const Main = styled('main')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'hidden',
});

const ContentDiv = styled('div')({
  paddingLeft: NAV_WIDTH,
});

const RootDiv = styled('div')({
  display: 'flex',
});

export const FILTERS_QUERY_KEY = 'filters';
export const SLIDE_QUERY_KEY = 'slide';
export const TIME_QUERY_KEY = 'time';
export const START_TIME_QUERY_KEY = 'startTime';
export const END_TIME_QUERY_KEY = 'endTime';

export const AppWrapper: React.FC = () => {
  const { pathname, search } = useLocation();
  const { selectedNamespace, clearNewEvents } = useContext(ApplicationContext);
  const [filterAnchor, setFilterAnchor] = useState<HTMLButtonElement | null>(
    null
  );
  const [searchParams, setSearchParams] = useSearchParams();
  // Table filters
  const [filterArray, setFilterArray] = useState<string[]>([]);
  const [filterString, setFilterString] = useState('');
  const [slideID, setSlideID] = useState<string | null>(null);
  // Date filter
  const [dateFilter, setDateFilter] = useState<ITimeFilterObject>();

  if (pathname === '/') {
    return (
      <Navigate
        to={`/${NAMESPACES_PATH}/${selectedNamespace}home`}
        replace={true}
      />
    );
  }

  useEffect(() => {
    initializeTimeSearchParams();
    initializeSlideSearchParams();
    initializeTableFilterSearchParams();
  }, [pathname, search]);

  useEffect(() => {
    clearNewEvents();
  }, [pathname]);

  const initializeTimeSearchParams = () => {
    const existingTimeParam = searchParams.get(TIME_QUERY_KEY);
    const existingStartParam = searchParams.get(START_TIME_QUERY_KEY);
    const existingEndParam = searchParams.get(END_TIME_QUERY_KEY);

    if (existingStartParam || existingEndParam) {
      setTimeSearchParam(
        TimeFilterEnum.custom,
        existingStartParam,
        existingEndParam
      );
      return;
    }

    if (
      existingTimeParam === TimeFilterEnum.custom &&
      !existingStartParam &&
      !existingEndParam
    ) {
      setTimeSearchParam(TimeFilterEnum['24hours']);
      return;
    }

    if (existingTimeParam === null || !(existingTimeParam in TimeFilterEnum)) {
      setTimeSearchParam(TimeFilterEnum['24hours']);
      return;
    }

    setDateFilter(getTimeFilterObject(existingTimeParam as TimeFilterEnum));
  };

  const setTimeSearchParam = (
    timeFilter: TimeFilterEnum,
    startTime?: string | null,
    endTime?: string | null
  ) => {
    const validStartTime =
      startTime && dayjs(startTime).isValid()
        ? dayjs(startTime).toISOString()
        : undefined;
    const validEndTime =
      endTime && dayjs(endTime).isValid()
        ? dayjs(endTime).toISOString()
        : undefined;
    if (timeFilter === TimeFilterEnum.custom) {
      if (validStartTime) {
        searchParams.set(START_TIME_QUERY_KEY, validStartTime);
      } else {
        searchParams.delete(START_TIME_QUERY_KEY);
      }

      if (validEndTime) {
        searchParams.set(END_TIME_QUERY_KEY, validEndTime);
      } else {
        searchParams.delete(END_TIME_QUERY_KEY);
      }
    } else {
      searchParams.delete(START_TIME_QUERY_KEY);
      searchParams.delete(END_TIME_QUERY_KEY);
    }
    searchParams.set(TIME_QUERY_KEY, timeFilter);
    setSearchParams(searchParams, { replace: true });

    const nextDateFilter = getTimeFilterObject(timeFilter, {
      startTime: validStartTime,
      endTime: validEndTime,
    });

    if (
      nextDateFilter.filterShortString !== dateFilter?.filterShortString ||
      nextDateFilter.filterString !== dateFilter?.filterString ||
      nextDateFilter.startTime !== dateFilter?.startTime ||
      nextDateFilter.endTime !== dateFilter?.endTime
    ) {
      setDateFilter(nextDateFilter);
    }
  };

  const initializeSlideSearchParams = () => {
    setSlideID(null);
    const existingSlideParam = searchParams.get(SLIDE_QUERY_KEY);
    if (existingSlideParam === null) {
      setSlideSearchParam(null);
    } else {
      setSlideSearchParam(existingSlideParam);
    }
  };

  const setSlideSearchParam = (slideID: string | null) => {
    if (slideID === null) {
      searchParams.delete(SLIDE_QUERY_KEY);
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.set(SLIDE_QUERY_KEY, slideID);
      setSearchParams(searchParams, { replace: true });
      setSlideID(slideID);
    }
  };

  const initializeTableFilterSearchParams = () => {
    const existingFilterArray = searchParams.getAll(FILTERS_QUERY_KEY);
    setFilterArray(existingFilterArray);
    setFilterString(`&${existingFilterArray.join('&')}`);
  };

  const addFilterToParams = (filter: string) => {
    searchParams.append(FILTERS_QUERY_KEY, filter);
    setSearchParams(searchParams, { replace: true });
    const filterArray = searchParams.getAll(FILTERS_QUERY_KEY);
    setFilterArray(filterArray);
    setFilterString(`&${filterArray.join('&')}`);
  };

  const clearAllFilters = () => {
    searchParams.delete(FILTERS_QUERY_KEY);
    setSearchParams(searchParams, { replace: true });
    setFilterArray([]);
    setFilterString('');
  };

  const removeFilter = (filterToRemove: string) => {
    const filters = searchParams.getAll(FILTERS_QUERY_KEY);
    searchParams.delete(FILTERS_QUERY_KEY);
    if (filters.length > 0) {
      filters.forEach((f) => {
        if (f !== filterToRemove) {
          searchParams.append(FILTERS_QUERY_KEY, f);
        }
      });
      setSearchParams(searchParams, { replace: true });
      const filterArray = searchParams.getAll(FILTERS_QUERY_KEY);
      setFilterArray(filterArray);
      setFilterString(`&${filterArray.join('&')}`);
    }
  };

  return (
    <RootDiv>
      <FilterContext.Provider
        value={{
          filterAnchor,
          setFilterAnchor,
          filterString,
          filterArray,
          addFilterToParams,
          removeFilter,
          clearAllFilters,
        }}
      >
        <DateFilterContext.Provider
          value={{
            searchParams,
            dateFilter,
            setTimeSearchParam,
          }}
        >
          <SlideContext.Provider
            value={{
              slideID,
              setSlideSearchParam,
            }}
          >
            <Main>
              <Navigation />
              <ContentDiv>
                <Outlet />
              </ContentDiv>
            </Main>
          </SlideContext.Provider>
        </DateFilterContext.Provider>
      </FilterContext.Provider>
    </RootDiv>
  );
};
