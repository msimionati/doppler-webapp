import React, { useState, useEffect } from 'react';
import ReportsFilters from './ReportsFilters/ReportsFilters';
import ReportsBox from './ReportsBox/ReportsBox';
import ReportsPageRanking from './ReportsPageRanking/ReportsPageRanking';
import ReportsTrafficSourcesOld from './ReportsTrafficSources/ReportsTrafficSourcesOld';
import ReportsDailyVisits from './ReportsDailyVisits/ReportsDailyVisits';
import ReportsHoursVisits from './ReportsHoursVisits/ReportsHoursVisits';
import { InjectAppServices } from '../../services/pure-di';
import { FormattedMessage } from 'react-intl';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import {
  SiteTrackingRequired,
  SiteTrackingNotAvailableReasons,
} from '../SiteTrackingRequired/SiteTrackingRequired';
import { Helmet } from 'react-helmet';
import { Loading } from '../Loading/Loading';
import { addDays, getStartOfDate } from '../../utils';
import { BoxMessage } from '../styles/messages';

// This value means the today date
const periodSelectedDaysDefault = 0; /* set this value temporarily for datahub performance issue */

/**
 * @param { Object } props
 * @param { import('../../services/pure-di').AppServices } props.dependencies
 */

const Reports = ({ dependencies: { datahubClient } }) => {
  const today = getStartOfDate(new Date());
  const [state, setState] = useState({
    periodSelectedDays: periodSelectedDaysDefault,
    dateFrom: addDays(today, periodSelectedDaysDefault * -1),
    dateTo: periodSelectedDaysDefault ? today : new Date(),
    dailyView: !periodSelectedDaysDefault,
  });

  const [totalVisits, setTotalVisits] = useState({});

  const changeDomain = async (name) => {
    const domainFound = state.domains.find((item) => item.name === name);
    setState((prevState) => ({ ...prevState, domainSelected: domainFound }));
  };

  const changePeriod = (daysToFilter) => {
    const today = getStartOfDate(new Date());
    setState((prevState) => ({
      ...prevState,
      periodSelectedDays: daysToFilter,
      dateFrom: addDays(today, daysToFilter * -1),
      dateTo: daysToFilter ? today : new Date(),
      dailyView: !daysToFilter,
    }));
  };

  useEffect(() => {
    const fetchVisitsByPeriod = async () => {
      setTotalVisits({ loading: true });
      const visitsWithoutEmail = await datahubClient.getTotalVisitsOfPeriodOld({
        domainName: state.domainSelected.name,
        dateFrom: state.dateFrom,
        dateTo: state.dateTo,
        emailFilter: 'without_email',
      });
      const visitsWithEmail = await datahubClient.getTotalVisitsOfPeriodOld({
        domainName: state.domainSelected.name,
        dateFrom: state.dateFrom,
        dateTo: state.dateTo,
        emailFilter: 'with_email',
      });

      setTotalVisits({
        withEmail: visitsWithEmail,
        withoutEmail: visitsWithoutEmail,
        loading: false,
      });
    };
    if (state.domainSelected) {
      fetchVisitsByPeriod();
    }
  }, [datahubClient, state.domainSelected, state.dateFrom, state.dateTo]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await datahubClient.getAccountDomains();
      if (response.success) {
        setState((prevState) => ({
          ...prevState,
          domains: response.value,
          domainSelected: response.value.length ? response.value[0] : null,
        }));
      }
    };

    fetchData();
  }, [datahubClient]);

  return (
    <>
      <FormattedMessage id="reports_title">
        {(reports_title) => (
          <Helmet>
            <title>{reports_title}</title>
          </Helmet>
        )}
      </FormattedMessage>
      {state.domains && !state.domainSelected ? (
        <SiteTrackingRequired reason={SiteTrackingNotAvailableReasons.thereAreNotDomains} />
      ) : (
        <>
          <ReportsFilters
            changeDomain={changeDomain}
            domains={state.domains}
            domainSelected={state.domainSelected}
            periodSelectedDays={state.periodSelectedDays}
            changePeriod={changePeriod}
          />
          {!state.domains ? (
            <Loading />
          ) : (
            <section className="dp-container">
              {!state.domainSelected.verified_date ? (
                <BoxMessage className="dp-msj-error bounceIn" spaceTopBottom>
                  <p>
                    <FormattedMessageMarkdown id="reports_filters.domain_not_verified_MD" />
                  </p>
                </BoxMessage>
              ) : null}
              <div className="dp-rowflex">
                <div className="col-lg-6 col-md-6 col-sm-12 m-b-24">
                  <ReportsBox
                    dateTo={state.dateTo}
                    dateFrom={state.dateFrom}
                    today={state.dailyView}
                    emailFilter={'without_email'}
                    visits={totalVisits.withoutEmail}
                    loading={totalVisits.loading}
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 m-b-24">
                  <ReportsBox
                    dateTo={state.dateTo}
                    dateFrom={state.dateFrom}
                    today={state.dailyView}
                    emailFilter={'with_email'}
                    visits={totalVisits.withEmail}
                    loading={totalVisits.loading}
                  />
                </div>
                {!state.dailyView ? (
                  <div className="col-sm-12 m-b-24">
                    <ReportsDailyVisits
                      domainName={state.domainSelected.name}
                      dateFrom={state.dateFrom}
                      dateTo={state.dateTo}
                    />
                  </div>
                ) : null}
                <div className="col-sm-12 m-b-24">
                  <ReportsTrafficSourcesOld
                    domainName={state.domainSelected.name}
                    dateFrom={state.dateFrom}
                    dateTo={state.dateTo}
                  />
                </div>
                {!state.dailyView ? (
                  <div className="col-sm-12 m-b-24">
                    <ReportsHoursVisits
                      domainName={state.domainSelected.name}
                      dateTo={state.dateTo}
                      dateFrom={state.dateFrom}
                    />
                  </div>
                ) : null}
                <div className="col-sm-12 m-b-24">
                  <ReportsPageRanking
                    domainName={state.domainSelected.name}
                    dateTo={state.dateTo}
                    dateFrom={state.dateFrom}
                  />
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
};

export default InjectAppServices(Reports);
