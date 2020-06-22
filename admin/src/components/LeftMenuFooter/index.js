/**
 *
 * LeftMenuFooter
 *
 */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import LeftMenuLink from '../LeftMenuLink';
import Wrapper from './Wrapper';
import messages from './messages.json';

defineMessages(messages);

const LeftMenuFooter = ({ version }) => {
  const location = useLocation();
  const staticLinks = [
    // {
    //   icon: 'book',
    //   label: 'documentation',
    //   destination: 'https://strapi.io/documentation',
    // },
    // {
    //   icon: 'question-circle',
    //   label: 'help',
    //   destination: 'https://strapi.io/help',
    // },
  ];

  return (
    <Wrapper>
      <ul className="list">
        {staticLinks.map(link => (
          <LeftMenuLink
            location={location}
            iconName={link.icon}
            label={messages[link.label].id}
            key={link.label}
            destination={link.destination}
          />
        ))}
      </ul>
      <div className="poweredBy">
        admin
      </div>
    </Wrapper>
  );
};

LeftMenuFooter.propTypes = {
  version: PropTypes.string.isRequired,
};

export default LeftMenuFooter;
