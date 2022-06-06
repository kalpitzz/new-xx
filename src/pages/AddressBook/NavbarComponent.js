import React, { useState } from 'react';
import styles from './AddressBook.module.css';
import CsvDownload from 'react-json-to-csv';
import { useDispatch } from 'react-redux';
import FormAction from '../../redux/actions/FormAction';
import NavBarModel from '../../components/navBarModel/navBarModel';
import { useNavigate } from 'react-router-dom';

const NavbarComponent = (props) => {
  const [border, setBorder] = useState('All Contact');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let Role = localStorage.getItem('role');

  const addnewHandler = (role) => {
    dispatch(FormAction.setFormType(role));
    role === 'Owner'
      ? navigate('/OwnerInvite')
      : navigate('/dynamicForm', { state: 'newForm' });
  };

  let list;
  switch (Role) {
    case 'DO':
      list = [
        { text: 'Driver', color: '#2ab3a2' },
        { text: 'Broker', color: '#ffc542' },
        { text: 'Dispatcher', color: '#689d2f' },
        { text: 'Others', color: '#3288e6' },
      ];
      break;
    case 'DISP':
      list = [
        { text: 'Driver', color: '#2ab3a2' },
        { text: 'Broker', color: '#ffc542' },
        { text: 'Owner', color: '#a066ff' },
        { text: 'Others', color: '#3288e6' },
      ];
      break;
    default:
      list = [
        { text: 'Driver', color: '#2ab3a2' },
        { text: 'Broker', color: '#ffc542' },
        { text: 'Owner', color: '#a066ff' },
        { text: 'Dispatcher', color: '#689d2f' },
        { text: 'Others', color: '#3288e6' },
      ];
      break;
  }

  return (
    <div className={styles.navborder}>
      <div className={styles.navhead}>
        <h2 className={styles.h2}>Address Book</h2>
        <div style={{ display: 'flex' }}>
          <CsvDownload className={`${styles.export}`} data={props.Data}>
            Export
          </CsvDownload>
          {Role !== 'D' ? (
            <NavBarModel
              style={{ display: 'none' }}
              buttonTag={'Add new'}
              list={list}
              parentFunction={addnewHandler}
            />
          ) : null}
        </div>
      </div>

      <ul className={styles.navul}>
        <button
          className={`${styles.navbutton} ${
            border === 'All Contact' ? styles.navActive : ''
          }`}
          value=""
          onClick={props.fun}
          onMouseDown={() => setBorder('All Contact')}
        >
          All Contact
        </button>

        <button
          className={`${styles.navbutton} ${
            border === 'Driver' ? styles.navActive : ''
          }`}
          value="driver"
          onClick={props.fun}
          onMouseDown={() => setBorder('Driver')}
          style={{ display: Role === 'D' ? 'none' : '' }}
        >
          Driver
        </button>
        <button
          className={`${styles.navbutton} ${
            border === 'Broker' ? styles.navActive : ''
          }`}
          value="broker"
          onClick={props.fun}
          onMouseDown={() => setBorder('Broker')}
          style={{ display: Role === 'D' ? 'none' : '' }}
        >
          Broker
        </button>
        <button
          className={`${styles.navbutton} ${
            border === 'Owner' ? styles.navActive : ''
          }`}
          value="owner"
          onClick={props.fun}
          onMouseDown={() => setBorder('Owner')}
          style={{
            display:
              Role === 'DO'
                ? 'none'
                : // : Role === 'DISP'
                // ? 'none'
                Role === 'D'
                ? 'none'
                : '',
          }}
        >
          Owner
        </button>
        <button
          className={`${styles.navbutton} ${
            border === 'Dispatcher' ? styles.navActive : ''
          }`}
          value="dispatcher"
          onClick={props.fun}
          style={{ display: Role === 'DISP' ? 'none' : '' }}
          onMouseDown={(e) => setBorder('Dispatcher')}
        >
          Dispatcher
        </button>
        <button
          className={`${styles.navbutton} ${
            border === 'Others' ? styles.navActive : ''
          }`}
          value="others"
          onClick={props.fun}
          onMouseDown={() => setBorder('Others')}
          style={{
            display: Role === 'D' ? 'none' : '',
          }}
        >
          Others
        </button>
        <button
          className={`${styles.navbutton} ${
            border === 'Invitation' ? styles.navActive : ''
          }`}
          value="invitation"
          onClick={props.fun}
          onMouseDown={() => setBorder('Invitation')}
          style={{
            display: Role === 'DM' ? '' : 'none',
          }}
        >
          Invitation
        </button>
      </ul>
    </div>
  );
};

export default NavbarComponent;
