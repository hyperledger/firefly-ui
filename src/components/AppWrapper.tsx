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
  CreatedFilterOptions,
  ICreatedTimeFilter,
  NAMESPACES_PATH,
} from '../interfaces';
import { getCreatedTimeFilter, isValidUUID } from '../utils';
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
  const { pathname } = useLocation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const [filterAnchor, setFilterAnchor] = useState<HTMLButtonElement | null>(
    null
  );
  const [searchParams, setSearchParams] = useSearchParams();
  // Table filters
  const [filterArray, setFilterArray] = useState<string[]>([]);
  const [filterString, setFilterString] = useState('');
  // Slide filters
  const [slideQuery, setSlideQuery] = useState<string | null>(null);
  // Date filter
  const [dateFilter, setDateFilter] = useState<ICreatedTimeFilter>(
    getCreatedTimeFilter('24hours')
  );

  if (pathname === '/') {
    return (
      <Navigate
        to={`/${NAMESPACES_PATH}/${selectedNamespace}home`}
        replace={true}
      />
    );
  }

  // Table Filters
  useEffect(() => {
    const filterArray = searchParams.getAll(FILTERS_QUERY_KEY);
    setFilterArray(filterArray);
    setFilterString(`&${filterArray.join('&')}`);
  }, [pathname]);

  // Slide ID
  useEffect(() => {
    const slideQuery = searchParams.get(SLIDE_QUERY_KEY);
    slideQuery !== null && setSlideQuery(slideQuery);
  }, [pathname, setSearchParams]);

  // Time string
  useEffect(() => {
    const timeString = searchParams.get(TIME_QUERY_KEY) as CreatedFilterOptions;
    if (timeString === null) {
      addDateToParams(dateFilter.filterShortString);
    } else {
      setDateFilter(getCreatedTimeFilter(timeString));
    }
  }, [pathname]);

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

  const addSlideToParams = (slideID: string | undefined) => {
    if (slideID === undefined) {
      searchParams.delete(SLIDE_QUERY_KEY);
    } else {
      isValidUUID(slideID) && searchParams.set(SLIDE_QUERY_KEY, slideID);
      setSearchParams(searchParams);
    }
  };

  const addDateToParams = (timeFilterString: CreatedFilterOptions) => {
    searchParams.set(TIME_QUERY_KEY, timeFilterString);
    setSearchParams(searchParams);
    setDateFilter(getCreatedTimeFilter(timeFilterString));
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
          clearAllFilters,
        }}
      >
        <DateFilterContext.Provider
          value={{
            searchParams,
            dateFilter,
            addDateToParams,
          }}
        >
          <SlideContext.Provider
            value={{
              slideQuery,
              addSlideToParams,
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
