import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { Query, Mutation } from 'react-apollo';

import EventPopover from '../Event/EventPopover';
import EventModal from '../Event/EventModal';
import { EVENTS_QUERY, CREATE_EVENT_MUTATION } from '../../queries';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const transformItems = eventsList =>
  eventsList.items.map(item => {
    return {
      ...item,
      email: item.email || '',
      description: item.description || '',
      start: new Date(item.startAt),
      end: new Date(item.endAt)
    };
  });

const Calendar = () => {
  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = React.useState(new Date());
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="calendar">
      <Query query={EVENTS_QUERY}>
        {({ data, loading, error }) => {
          if (error) return console.log(error);
          if (loading) return <p>Loading...</p>;

          return (
            <div style={{ height: '100vh' }}>
              <BigCalendar
                localizer={BigCalendar.momentLocalizer(moment)}
                events={transformItems(data.eventsList)}
                components={{ event: EventPopover }}
                showMultiDayTimes
                selectable
                onSelectSlot={({ start, end }) => {
                  setSelectedStartDate(start);
                  setSelectedEndDate(end);
                  setIsModalOpen(true);
                }}
              />

              <EventModal
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                event={{
                  startAt: selectedStartDate,
                  endAt: selectedEndDate,
                  title: '',
                  email: '',
                  description: ''
                }}
              />
            </div>
          );
        }}
      </Query>
    </div>
  );
};

export default Calendar;
