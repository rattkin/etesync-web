import * as React from 'react';
const Fragment = (React as any).Fragment;
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import CommunicationCall from 'material-ui/svg-icons/communication/call';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';
import { indigo500 } from 'material-ui/styles/colors';

import * as ICAL from 'ical.js';

class ViewContact extends React.Component {
  props: {
    contact?: ICAL.Component,
  };

  render() {
    if (this.props.contact === undefined) {
      return (<div>Loading</div>);
    }

    const contact = this.props.contact;
    const uid = contact.getFirstPropertyValue('uid');
    const name = contact.getFirstPropertyValue('fn');

    const phoneNumbers = contact.getAllProperties('tel').map((prop, idx) => {
      const json = prop.toJSON();
      const values = prop.getValues().map((val) => (
        <ListItem
          key={idx}
          leftIcon={<CommunicationCall />}
          rightIcon={<CommunicationChatBubble />}
          primaryText={val}
          secondaryText={json[1].type}
        />
      ));
      return values;
    });

    const emails = contact.getAllProperties('email').map((prop, idx) => {
      const json = prop.toJSON();
      const values = prop.getValues().map((val) => (
        <ListItem
          key={idx}
          leftIcon={<CommunicationEmail color={indigo500} />}
          primaryText={val}
          secondaryText={json[1].type}
        />
      ));
      return values;
    });

    const skips = ['tel', 'email', 'prodid', 'uid', 'fn', 'n', 'version', 'photo'];
    const theRest = contact.getAllProperties().filter((prop) => (
      skips.indexOf(prop.name) === -1
      )).map((prop, idx) => {
      const values = prop.getValues().map((_val) => {
        const val = (_val instanceof String) ? _val : _val.toString();
        return (
          <ListItem
            key={idx}
            insetChildren={true}
            primaryText={(window as any).me = val}
            secondaryText={prop.name}
          />
        );
      });
      return values;
    });

    function listIfNotEmpty(items: Array<Array<JSX.Element>>) {
      if (items.length > 0) {
        return (
          <Fragment>
            <List>
              {items}
            </List>
            <Divider inset={true} />
          </Fragment>
        );
      } else {
        return undefined;
      }
    }

    return (
      <div>
        <h3>{name}</h3>
        <span>{uid}</span>
        {listIfNotEmpty(phoneNumbers)}
        {listIfNotEmpty(emails)}
        <List>
          {theRest}
        </List>
      </div>
    );
  }
}

export default ViewContact;