import React, { useEffect, useState, useRef } from 'react';
import MaterialTable from '@material-table/core';
import tableIcons from './TableIcons';
import style from './Table.module.css';
import Navbar from './Navbar';
import Modals from '../../components/tableModal/Modals';
import { useDispatch, useSelector } from 'react-redux';
import useAxios from '../../hooks/useAxios';
import EquipmentAction from '../../redux/actions/equipmentAction';
import { useNavigate } from 'react-router-dom';
import NavbarModel from '../../components/navBarModel/navBarModel';
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import useAuth from '../../hooks/useAuth';

const Table = () => {
  const AxiosApi = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state.equipmentReducer);
  const TruckData = useSelector((state) => state.equipmentReducer.truckData);
  const TrailerData = useSelector(
    (state) => state.equipmentReducer.trailerData
  );
  console.log('T', TruckData);
  console.log('TR', TrailerData);
  const [response, setresponse] = useState();
  const [render, setrender] = useState(0);
  const [type, setType] = useState('Truck');
  const [deleteID, setDeleteID] = useState();
  const closetableModelRef = useRef();
  const { auth } = useAuth();
  const loginRole = auth.role;
  console.log('roleT', loginRole);

  useEffect(() => {
    if (!TruckData || !TrailerData) {
      AxiosApi('/equipments/truck/').then((res) => {
        dispatch(EquipmentAction.setTruckData(res));
        setresponse(res);
        setrender(1);
      });
      AxiosApi('/equipments/trailer/').then((res) => {
        dispatch(EquipmentAction.setTrailerData(res));
      });
    } else {
      setresponse(TruckData);
      setrender(1);
    }
  }, []);

  const handleNavbar = (value) => {
    value === 'Truck' ? setresponse(TruckData) : setresponse(TrailerData);
    setType(value);
  };

  const editHandler = (id) => {
    dispatch(EquipmentAction.previewAction({ edit_type: type, edit_id: id }));
    dispatch(EquipmentAction.setType(type));

    if (type === 'Trailer') {
      navigate(`/equipment/${type.toLowerCase()}form`);
    } else {
      navigate('/equipment/addNewEquipment');
    }
  };

  const deleteHandler = (id) => {
    AxiosApi.delete(`/equipments/${type.toLowerCase()}/${id}/`).then(() => {
      dispatch(EquipmentAction.deleteAction({ type: type, id: id }));
    });
    // closetableModelRef.current.closeModelHandler();
  };

  // const addnewHandler = (item) => {
  //   navigate(`/equipment/${item.toLowerCase()}form`);
  //   dispatch(EquipmentAction.setType(item));
  // };
  const addnewHandler = (item) => {
    item === 'Truck'
      ? navigate('/equipment/addNewEquipment')
      : navigate('/equipment/trailerform');
    dispatch(EquipmentAction.setType(item));
  };

  useEffect(() => {
    if (type === 'Truck') {
      setresponse(TruckData);
    } else {
      setresponse(TrailerData);
    }
  }, [state]);

  // let tableTitle = render
  //   ? [
  //       Object.keys(response[0]).map((item, index) => {
  //         return {
  //           field: item,
  //           sorting: false,
  //           tableData: {
  //             additionalWidth: 0,
  //             columnOrder: index,
  //             filterValue: undefined,
  //             groupOrder: undefined,
  //             groupSort: 'asc',
  //             id: index,
  //             initialWidth: 'calc((100% - 0px) / 8)',
  //             width: 'calc((100% - 0px) / 8)',
  //             widthPx: NaN,
  //           },

  //           title: item,
  //         };
  //       }),
  //     ]
  //   : [];

  return (
    <div>
      <div className={style.header}>
        <div>
          <h2>Equipment Table</h2>
        </div>
        {loginRole === 'DM' || loginRole === 'TL' ? (
          <NavbarModel
            buttonTag={'Add new'}
            list={[
              { text: 'Truck', color: '#3288e6' },
              { text: 'Trailer', color: '#2ab3a2' },
            ]}
            parentFunction={addnewHandler}
          />
        ) : null}
      </div>
      {render ? (
        <div className={style.materialTable}>
          <Navbar setresponse={handleNavbar} />
          <MaterialTable
            title={''}
            options={{
              exportMenu: [
                {
                  label: 'Export PDF',
                  exportFunc: (cols, datas) =>
                    ExportPdf(cols, response, `${type}-Export`),
                },
                {
                  label: 'Export CSV',
                  exportFunc: (cols, datas) =>
                    ExportCsv(cols, response, `${type}-Export`),
                },
              ],
              filtering: false,
              exportButton: true,
              paginationType: 'stepped',
            }}
            icons={tableIcons}
            onRowClick={(props, data) => {
              setDeleteID(data.id);
              if (props.target.id !== 'pop') {
                console.log(data);
                dispatch(EquipmentAction.setPreviewData(data));
                dispatch(EquipmentAction.setType(type));
                type === 'Truck'
                  ? navigate('/truck_details_preview')
                  : navigate('/trailer_details_preview');
              }
            }}
            columns={[
              {
                title: 'Unit No.',
                field: 'unit_number',
                sorting: false,
              },
              { title: 'Carrier', field: 'company_name' },
              { title: 'Status', field: 'status' },
              {
                title: 'Vin',
                field: 'VIN',
              },
              { title: 'Model', field: 'model' },
              { title: 'Make', field: 'make' },
              {
                title: 'purchase year',
                field: 'year_purchased',
              },
              {
                field: '',
                title: '',
                render: () => (
                  <Modals
                    deleteHandler={deleteHandler}
                    editHandler={editHandler}
                    id={deleteID}
                    ref={closetableModelRef}
                  />
                ),
              },
            ]}
            data={response}
            components={{
              Container: (props) => (
                <div className={style.mytable} {...props} />
              ),
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Table;
