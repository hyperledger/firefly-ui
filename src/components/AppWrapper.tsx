import { styled } from '@mui/material';
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
import { getTimeFilterObject, isValidUUID } from '../utils';
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

export const AppWrapper: React.FC = () => {
  const { pathname, search } = useLocation();
  const { selectedNamespace } = useContext(ApplicationContext);
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

  const initializeTimeSearchParams = () => {
    // If date has already been set
    if (
      dateFilter?.filterShortString &&
      dateFilter?.filterShortString in TimeFilterEnum
    ) {
      setTimeSearchParam(dateFilter.filterShortString);
      return;
    }
    // If time param is invalid
    const existingTimeParam = searchParams.get(TIME_QUERY_KEY);
    if (existingTimeParam === null || !(existingTimeParam in TimeFilterEnum)) {
      setTimeSearchParam(TimeFilterEnum['24hours']);
    } else {
      // Set filter string for components to consume
      setDateFilter(getTimeFilterObject(existingTimeParam as TimeFilterEnum));
    }
  };

  const setTimeSearchParam = (timeFilter: TimeFilterEnum) => {
    searchParams.set(TIME_QUERY_KEY, timeFilter);
    setSearchParams(searchParams);
    if (
      getTimeFilterObject(timeFilter).filterShortString !==
      dateFilter?.filterShortString
    ) {
      setDateFilter(getTimeFilterObject(timeFilter));
    }
  };

  const initializeSlideSearchParams = () => {
    setSlideID(null);
    const existingSlideParam = searchParams.get(SLIDE_QUERY_KEY);
    if (existingSlideParam === null || !isValidUUID(existingSlideParam)) {
      setSlideSearchParam(null);
    } else {
      setSlideSearchParam(existingSlideParam);
    }
  };

  const setSlideSearchParam = (slideID: string | null) => {
    if (slideID === null) {
      searchParams.delete(SLIDE_QUERY_KEY);
      setSearchParams(searchParams);
    } else if (isValidUUID(slideID)) {
      searchParams.set(SLIDE_QUERY_KEY, slideID);
      setSearchParams(searchParams);
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
    setSearchParams(searchParams);
    const filterArray = searchParams.getAll(FILTERS_QUERY_KEY);
    setFilterArray(filterArray);
    setFilterString(`&${filterArray.join('&')}`);
  };

  const clearAllFilters = () => {
    searchParams.delete(FILTERS_QUERY_KEY);
    setSearchParams(searchParams);
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
      setSearchParams(searchParams);
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
