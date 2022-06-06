// this page or component make for maintain the address Book in which all the contact data show in the table format with searching filtering and editinng

import React, { useState, useEffect, useRef } from 'react';
import Styles from './AddressBook.module.css';
// import { TablePagination } from '@mui/material';
import { Pagination } from '@material-ui/lab';
import usePagination from '../../components/Pagination/pagination';
import ABCDButton from './ABCDButton';
import NavbarComponent from './NavbarComponent';
import useAxios from '../../hooks/useAxios';
import Modals from '../../components/tableModal/Modals';
import { useDispatch, useSelector } from 'react-redux';
import FormAction from '../../redux/actions/FormAction';
import { useNavigate } from 'react-router-dom';

const AddressBook = () => {
  let [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const [search, setsearch] = useState('');
  const [abcdValue, setabcdValue] = useState('');
  const [role, setrole] = useState('');
  const [response, setresponse] = useState();
  const [render, setrender] = useState(0);
  const AxiosApi = useAxios();
  const dispatch = useDispatch();
  const axiosApi = useAxios();
  let navigate = useNavigate();

  const closetableModelRef = useRef();

  const addressBook = useSelector((state) => state.FormReducer.addressBookData);
  const state = useSelector((state) => state.FormReducer);
  const invitation = useSelector((state) => state.FormReducer.invitation);
  useEffect(() => {
    if (!addressBook) {
      AxiosApi('/company/invitation/').then((inviteRes) => {
        console.log(inviteRes);
        dispatch(FormAction.setInviteDetails(inviteRes));
        AxiosApi('/company/alladdresscomplete/').then((res) => {
          let newArray = [
            ...res.broker.map((item) => ({ ...item, role: 'Broker' })),
            ...res.others.map((item) => ({ ...item, role: 'Others' })),

            ...res.driver.map((item) => ({
              ...item,
              role: 'Driver',
            })),
            ...res.carrier.map((item) => ({
              ...item,
              role: 'Owner',
            })),
            ...res.dispatcher.map((item) => ({
              ...item,
              role: 'Dispatcher',
              company_name: 'Metro Max',
            })),
            ...inviteRes.map((item) => ({
              ...item,
              role: 'Invitation',
            })),
          ];
          dispatch(FormAction.setAddressBook(newArray));
          console.log('newArray', newArray);
          setresponse(newArray);
          setrender(1);
        });
      });
    } else {
      setresponse(addressBook);
      console.log(addressBook);
      setrender(1);
    }
  }, [addressBook, dispatch]);

  useEffect(() => {
    setresponse(addressBook);
  }, [state]);

  let renderData;

  renderData = render
    ? response
        .filter((data) => {
          return Object.values(data !== null ? data : '')
            .join(' ')
            .toLowerCase()
            .includes(search.toLowerCase());
        })
        // .filter((data) => {
        //   return Object.values(
        //     data.company_name !== null ? data.company_name : ''
        //   )
        //     .join(' ')
        //     .charAt(0)
        //     .toUpperCase()
        //     .includes(abcdValue);
        // })
        .filter((data) => {
          return Object.values(data.role !== null ? data.role : '')
            .join('')
            .toLowerCase()
            .includes(role.toLowerCase());
        })
    : '';
  const count = Math.ceil(renderData.length / PER_PAGE);
  const data = usePagination(renderData, PER_PAGE);
  const handlePageChange = (e, p) => {
    setPage(p);
    data.jump(p);
  };

  const handleSearch = (e) => {
    setsearch(e.target.value);
  };
  const handleChange = (e) => {
    setabcdValue(e.target.value);
  };

  const handleRoleChange = (e) => {
    setrole(e.target.value);
    setPage(1);
    data.jump(1);
  };

  const handleClickOnCompanyName = (e, role, id, application) => {
    dispatch(FormAction.setFormType(role));
    dispatch(FormAction.setPreviewId(id));
    navigate(
      e.target.id !== 'pop'
        ? role === 'Owner'
          ? '/OwnerFormPreview'
          : role === 'Invitation' && application
          ? `/OwnerFormPreview`
          : role !== 'Invitation'
          ? `/dynamicFormPreview`
          : '#'
        : '#'
    );
  };

  const approveHandler = (id) => {
    axiosApi.post(`/company/invitation/${id}/approve/`);
  };

  const check = (item) => {
    return item === null ? '' : item;
  };

  const previewHandler = (id, role) => {
    switch (role) {
      case 'Driver':
        axiosApi.get(`/drivers/${id}/`).then((res) => {
          dispatch(FormAction.setFormType(role));
          dispatch(FormAction.setPreview(res));
          dispatch(FormAction.setPreviewId(id));
          navigate('/dynamicForm');
        });
        break;
      case 'Others':
        axiosApi.get(`/company/others/${id}/`).then((res) => {
          dispatch(FormAction.setFormType(role));
          dispatch(FormAction.setPreview(res));
          dispatch(FormAction.setPreviewId(id));
          navigate('/dynamicForm');
        });

        break;
      case 'Broker':
        axiosApi.get(`/company/broker/${id}/`).then((res) => {
          dispatch(FormAction.setFormType(role));
          dispatch(FormAction.setPreview(res));
          dispatch(FormAction.setPreviewId(id));
          navigate('/dynamicForm');
        });
        break;
      case 'Dispatcher':
        axiosApi.get(`/company/dispatcher/${id}/`).then((res) => {
          dispatch(FormAction.setFormType(role));
          dispatch(FormAction.setPreview(res));
          dispatch(FormAction.setPreviewId(id));
          navigate('/dynamicForm');
        });
        break;
      case 'Owner':
        axiosApi.get(`/company/carrier/${id}/`).then((res) => {
          dispatch(FormAction.setFormType(role));
          dispatch(FormAction.setPreview(res));
          dispatch(FormAction.setPreviewId(id));
          navigate('/OwnerForm');
        });
        break;
      case 'Invitation':
        console.log(invitation);
        console.log(role);
        console.log(id);
        dispatch(FormAction.setFormType(role));
        dispatch(
          FormAction.setPreview(
            invitation.filter((item) => item.id === id)[0].application
          )
        );
        dispatch(FormAction.setPreviewId(id));
        navigate('/OwnerForm');
        break;
      default:
        break;
    }
  };

  const deleteHandler = async (id, role) => {
    switch (role) {
      case 'Broker':
        await axiosApi.delete(`/company/broker/${id}/`).then(() => {
          closetableModelRef.current.closeModelHandler();
          dispatch(FormAction.deleteAction({ id: id, role: role }));
        });
        break;
      case 'Driver':
        axiosApi.delete(`/drivers/${id}/`).then(() => {
          closetableModelRef.current.closeModelHandler();
          dispatch(FormAction.deleteAction({ id: id, role: role }));
        });
        break;
      case 'Others':
        axiosApi
          .delete(`/company/others/${id}/`)
          .then(() => {
            closetableModelRef.current.closeModelHandler();
          })
          .then(() => {
            dispatch(FormAction.deleteAction({ id: id, role: role }));
          });
        break;
      case 'Dispatcher':
        axiosApi.delete(`/company/dispatcher/${id}/`).then(() => {
          closetableModelRef.current.closeModelHandler();
          dispatch(FormAction.deleteAction({ id: id, role: role }));
        });
        break;
      case 'Owner':
        axiosApi.delete(`/company/carrier/${id}/`).then(() => {
          closetableModelRef.current.closeModelHandler();
          dispatch(FormAction.deleteAction({ id: id, role: role }));
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <NavbarComponent fun={handleRoleChange} Data={response} />
      <i className={`bx bx-search ${Styles.searchIcon}`}></i>

      <input
        type="search"
        placeholder={`Enter for search`}
        value={search}
        onChange={handleSearch}
        className={Styles.searchStyle}
      ></input>

      <div className={Styles.sideABCDButton}>
        <ABCDButton fun={handleChange} />
      </div>

      <div className={Styles.table_Div}>
        <table id="Address-Book" className={`${Styles.table} ${Styles.tableM}`}>
          <thead className={Styles.thead}>
            <tr className={Styles.tr}>
              <th className={Styles.th}>Company Name</th>
              <th className={Styles.th}>Contact Name</th>
              <th className={Styles.th}>Email Address</th>
              <th className={Styles.th}>Phone Number</th>
              {role === 'invitation' ? (
                <th className={Styles.th}>Status</th>
              ) : role === '' ? (
                <th className={Styles.th}>Type</th>
              ) : null}
              <th className={Styles.th}></th>
            </tr>
          </thead>
          <tbody className={Styles.tbody}>
            {render
              ? data.currentData().map((data, index) => {
                  return (
                    <tr key={index} className={Styles.tr}>
                      <td
                        className={Styles.td}
                        onClick={(e) =>
                          handleClickOnCompanyName(
                            e,
                            data.role,
                            data.id,
                            data.role === 'Invitation' ? data.application : null
                          )
                        }
                      >
                        {data.name || data.company_name}
                      </td>
                      <td
                        className={Styles.td}
                        onClick={(e) =>
                          handleClickOnCompanyName(
                            e,
                            data.role,
                            data.id,
                            data.role === 'Invitation' ? data.application : null
                          )
                        }
                      >
                        {data.role === 'Owner'
                          ? check(data.contact_name)
                          : data.role === 'Dispatcher' ||
                            data.role === 'Invitation' ||
                            data.role === 'Driver'
                          ? check(data.user.first_name) +
                            ' ' +
                            check(data.user.last_name)
                          : data.role === 'Others' || data.role === 'Broker'
                          ? check(data.first_name) + ' ' + check(data.last_name)
                          : ''}
                      </td>
                      <td
                        className={Styles.td}
                        onClick={(e) =>
                          handleClickOnCompanyName(
                            e,
                            data.role,
                            data.id,
                            data.role === 'Invitation' ? data.application : null
                          )
                        }
                      >
                        {data.role === 'Owner'
                          ? check(data.email)
                          : data.role === 'Others' || data.role === 'Broker'
                          ? check(data.contact_email)
                          : data.role === 'Dispatcher' ||
                            data.role === 'Invitation' ||
                            data.role === 'Driver'
                          ? check(data.user.email)
                          : ''}
                      </td>
                      <td
                        className={Styles.td}
                        onClick={(e) =>
                          handleClickOnCompanyName(
                            e,
                            data.role,
                            data.id,
                            data.role === 'Invitation' ? data.application : null
                          )
                        }
                      >
                        {/* {data.phone || data.contact_phone || data.user.phone} */}
                        {data.role === 'Owner'
                          ? check(data.phone)
                          : data.role === 'Others' || data.role === 'Broker'
                          ? check(data.contact_phone)
                          : data.role === 'Dispatcher' ||
                            data.role === 'Invitation' ||
                            data.role === 'Driver'
                          ? check(data.user.phone)
                          : ''}
                      </td>
                      {role === 'invitation' ? (
                        <td
                          className={Styles.td}
                          onClick={(e) =>
                            handleClickOnCompanyName(
                              e,
                              data.role,
                              data.id,
                              data.role === 'Invitation'
                                ? data.application
                                : null
                            )
                          }
                        >
                          {data.application !== null ? 'Submitted' : 'Pending'}
                        </td>
                      ) : role === '' ? (
                        <td
                          className={Styles.td}
                          onClick={(e) =>
                            handleClickOnCompanyName(
                              e,
                              data.role,
                              data.id,
                              data.role === 'Invitation'
                                ? data.application
                                : null
                            )
                          }
                        >
                          {data.role}
                        </td>
                      ) : null}

                      <td>
                        <Modals
                          id={data.id}
                          role={data.role}
                          editHandler={previewHandler}
                          deleteHandler={deleteHandler}
                          approveHandler={approveHandler}
                          ref={closetableModelRef}
                          invite={role === 'invitation' ? true : false}
                        />
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
        <div className={Styles.pagination}>
          <Pagination
            count={count}
            size="medium"
            page={page}
            variant="text"
            shape="rounded"
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default AddressBook;
