import styled from 'styled-components';
import colors from '../../styles/colors';

export const Container = styled.div`
  display: flex;
  flex-flow: wrap;
  & > div:nth-child(odd) {
    background: ${colors.smoothGrey};
  }
  & > div:nth-child(n + 4) {
    margin-top: 10px;
  }
`;

export const TrafficSourceContainer = styled.div`
  flex: calc(100% / 3);
  box-shadow: 2px 0 4px 0 rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid ${colors.softGrey};
  border-top: 1px solid ${colors.softGrey};
  padding: 40px 30px;
`;

export const TrafficSourceHeader = styled.header`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  color: ${colors.darkGrey};

  h6 {
    line-height: 1;
    margin: 0;
  }
`;
