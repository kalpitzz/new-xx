// this page used for the registration of new trailer in this page we use fromTextField component which is come from load registration form and css come from carrier.module.css for make this page we use the css grid property.

//  ----------------------------IMPORT THE COMPONENT---------------------------------------------------------

import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import FormTextfield from '../../components/Formfield/formikControl';
import style from './index.module.css';
import { Formik, Form } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import { useDispatch, useSelector } from 'react-redux';
import EquipmentAction from '../../redux/actions/equipmentAction';
import AlertModel from '../../components/modals/AlertModel';
import usaCities from '../../assets/JsonData/Usa-States-data.json';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import * as Yup from 'yup';

// -------------------------------------------initial Value of truck---------------------------------------------------------
let intValue = {
  insurance: {
    company_name: '',
    policy_number: '',
    insurance_expiration_date: '',
    insurance_file: '',
  },
  license: {
    plate_number: '',
    license_expiration_date: '',
    registered_state: '',
    inspection_date: '',
    license_file: '',
  },

  document: {
    document_name: '',
    file: '',
    description: '',
  },
  company: '',
  unit_number: '',
  dispatcher: '',
  // year: "",
  model: '',
  make: '',
  fuel_type: '',
  gross_weight: '',
  no_of_axle: '',
  vd_additional_notes: '',
  year_purchased: '',
  VIN: '',
  owner_name: '',
  title_number: '',
  height: '',
  unladen_weight: '',
  serial_number: '',
  ad_additional_notes: '',
  cost: '',
  fair_market_value: '',
  color: '',
  tire_info: '',
  notes: '',
  bd_additional_notes: '',
  status: '',
  driver: '',
  trailer: '',
};

// -------------------------------------------initial Value of trailer---------------------------------------------------------
let trailerIntValue = {
  insurance: {
    company_name: '',
    policy_number: '',
    insurance_expiration_date: '',
    insurance_file: '',
  },
  license: {
    plate_number: '',
    license_expiration_date: '',
    registered_state: '',
    inspection_date: '',
    license_file: '',
  },

  document: {
    document_name: '',
    file: '',
    description: '',
  },
  company: '',
  unit_number: '',
  dispatcher: '',
  // year: "",
  model: '',
  make: '',
  trailer_type: '',
  trailer_length: '',
  no_of_axle: '',
  pd_additional_notes: '',
  year_purchased: '',
  VIN: '',
  owner_name: '',
  title_number: '',
  height: '',
  unladen_weight: '',
  serial_number: '',
  ad_additional_notes: '',
  cost: '',
  fair_market_value: '',
  color: '',
  tire_info: '',
  notes: '',
  bd_additional_notes: '',
  status: '',
};
// -------------------------------------------Select status Option for truck and trailer---------------------------------------------------------
const selectOption = [
  {
    key: 'Select Status',
    value: '',
  },
  {
    key: 'Active',
    value: 'active',
  },
  {
    key: 'Inactive',
    value: 'inactive',
  },
  {
    key: 'Under_Maintenance',
    value: 'under_maintenance',
  },
];

// ------------------------------------------- Select trailer type  Option---------------------------------------------------------

const trailerOption = [
  {
    key: 'Select trailer type',
    value: '',
  },
  {
    key: 'Dry Van',
    value: 'dry_van',
  },
  {
    key: 'Reefer',
    value: 'reefer',
  },
  {
    key: 'Flat Bed',
    value: 'flat_bed',
  },
  {
    key: 'Step Deck',
    value: 'step_deck',
  },
  {
    key: 'Low Boy',
    value: 'low_boy',
  },
];
// -------------------------------------------SELECT FUEL TYPE FOR TRUCK---------------------------------------------------------
const Fuel = [
  {
    key: 'Select Fuel Type',
    value: '',
  },
  {
    key: 'Diesel',
    value: 'Diesel',
  },
  {
    key: 'Electric',
    value: 'Electric',
  },
  {
    key: 'Petrol',
    value: 'Petrol',
  },
  {
    key: 'Other',
    value: 'Other',
  },
];

// -------------------------------------------START FUCTION ---------------------------------------------------------
const AddNewTrailer = forwardRef(
  (
    {
      typeProp = false,
      trailerFormHandler,
      driverFormHandler,
      callApiParent,
      truckFormHandler,
    },
    ref
  ) => {
    const [carrierName, setcarrierName] = useState([
      { key: 'Loading...', value: '' },
    ]);
    const [dispatcherName, setDispatcherName] = useState([
      { key: 'Loading...', value: '' },
    ]);

    const [trailerID, setTrailerID] = useState([
      { key: 'Loading...', value: '', company: '', truck: '' },
    ]);

    const [driverID, setDriverID] = useState([
      { key: 'Loading...', value: '' },
    ]);

    const [availableTrailer, setAvailableTrailer] = useState();
    const [availableDriver, setAvailableDriver] = useState();
    const { auth } = useAuth();
    const loginRole = auth.role;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleback = () => {
      if (!isPopUp) {
        dispatch(EquipmentAction.resetForm());
      }
      navigate('/equipment');
    };

    let state = useSelector((state) => state.equipmentReducer.type);
    let isPopUp = useSelector((state) => state.equipmentReducer.isPopUp);
    console.log(isPopUp);

    state =
      typeProp === 'Dispatch_Truck' ? 'Truck' : typeProp ? typeProp : state;
    //  HERE STATE USE AS A PROPS TO CALL THE TRUCK AND TRAILER VALUE---------------------------------------------------------
    // let { state } = useLocation();
    const AxiosApi = useAxios();
    // CALL CARRIER AND DISPATCHER API ON - COMPONENT DID MOUNT LIFE CYCLE----------------------------------------------------
    let Name = [{ key: 'Select carrier name', value: '' }];

    async function callApi() {
      await AxiosApi('/company/carrier/')
        .then((res) => {
          res.map((data) => Name.push({ key: data.name, value: data.id }));
        })
        .catch((err) => {
          toast.error('Reconnecting...');
          callApi();
        });
    }
    let dispatcher = [{ key: 'Select Dispatcher name', value: '' }];
    async function callDispatcherApi() {
      await AxiosApi('/company/dispatcher/')
        .then((res) => {
          res.map((data) =>
            dispatcher.push({
              key: `${data.user.first_name} ${data.user.last_name}`,
              value: data.id,
            })
          );
        })
        .catch((err) => {
          toast.error('Reconnecting...');
          callDispatcherApi();
        });
    }
    let trailerCount = 0;
    let trailer = [
      { key: 'Select Trailer', value: '', company: '', truck: '' },
    ];

    const form_pre_fill = useSelector(
      (state) => state.equipmentReducer.form_pre_fill
    );

    async function callTrailerApi() {
      trailerCount = trailerCount + 1;
      await AxiosApi('/equipments/trailer/')
        .then((res) => {
          res.map((data) =>
            trailer.push({
              key: data.unit_number,
              value: data.id,
              company: data.company,
            })
          );
        })
        .catch((err) => {
          toast.error('Failed to Fetch Trailer Data!Reconnecting...');
          if (trailerCount < 2) {
            callTrailerApi();
          }
        });
    }
    let driverCount = 0;
    let driver = [{ key: 'Select Driver', value: '', company: '' }];
    async function callDriverApi() {
      driverCount = driverCount + 1;
      await AxiosApi('/drivers/')
        .then((res) => {
          res.map((data) =>
            driver.push({
              key: `${data.user.first_name} ${data.user.last_name}`,
              value: data.id,
              company: data.company_id,
            })
          );
        })
        .catch((err) => {
          toast.error('Failed to Fetch Driver Data!Reconnecting...');
          if (driverCount < 2) {
            callDriverApi();
          }
        });
    }
    useEffect(() => {
      callApi().then(() => setcarrierName(Name));
      callDispatcherApi().then(() => setDispatcherName(dispatcher));
      callTrailerApi()
        .then(() => setAvailableTrailer(trailer))
        .then(() =>
          form_pre_fill
            ? trailerFilter(form_pre_fill[0].company, trailer)
            : setTrailerID(trailer)
        );
      callDriverApi()
        .then(() => setAvailableDriver(driver))
        .then(() =>
          form_pre_fill
            ? driverFilter(form_pre_fill[0].company, driver)
            : setDriverID(driver)
        );
    }, []);

    useImperativeHandle(ref, () => ({
      callTrailerHandler() {
        callTrailerApi().then(() => setTrailerID(trailer));
      },
      callDriverHandler() {
        callDriverApi().then(() => setDriverID(driver));
      },
    }));
    // ---------------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
      return () => {
        if (isPopUp) {
          dispatch(EquipmentAction.isPopUp(false));
        }
        if (typeProp === 'Trailer') {
          window.scrollTo(0, document.body.scrollHeight);
        }
      };
    }, [dispatch]);

    useEffect(() => {
      if (typeProp === 'Trailer') {
        window.scrollTo(0, 0);
      }
    }, []);

    function check(item) {
      return item === null || item === undefined ? '' : item;
    }

    let fillValuesTruck;
    let fillValuesTrailer;

    const alertRef = useRef();
    // Initial values for EDIT------------------------------------------------------------------------------------------------------
    if (form_pre_fill && state === 'Truck') {
      fillValuesTruck = {
        insurance: {
          id: form_pre_fill[0].insurance.id,
          company_name: check(form_pre_fill[0].insurance.company_name),
          policy_number: check(form_pre_fill[0].insurance.policy_number),
          insurance_expiration_date: check(
            form_pre_fill[0].insurance.insurance_expiration_date
          ),
          insurance_file: '',
        },
        license: {
          id: form_pre_fill[0].license.id,
          plate_number: check(form_pre_fill[0].license.plate_number),
          license_expiration_date: check(
            form_pre_fill[0].license.license_expiration_date
          ),
          registered_state: check(form_pre_fill[0].license.registered_state),
          inspection_date: check(form_pre_fill[0].license.inspection_date),
          license_file: '',
        },

        document: {
          id: form_pre_fill[0].document.id,
          document_name: check(form_pre_fill[0].document.document_name),
          file: '',
          description: check(form_pre_fill[0].document.description),
        },
        company: check(form_pre_fill[0].company),
        unit_number: check(form_pre_fill[0].unit_number),
        dispatcher: check(form_pre_fill[0].dispatcher),
        driver: check(form_pre_fill[0].driver),
        trailer: check(form_pre_fill[0].trailer),
        // year: "",
        model: check(form_pre_fill[0].model),
        make: check(form_pre_fill[0].make),
        fuel_type: check(form_pre_fill[0].fuel_type),
        gross_weight: check(form_pre_fill[0].gross_weight),
        no_of_axle: check(form_pre_fill[0].no_of_axle),
        vd_additional_notes: check(form_pre_fill[0].vd_additional_notes),
        year_purchased: check(form_pre_fill[0].year_purchased),
        VIN: check(form_pre_fill[0].VIN),
        owner_name: check(form_pre_fill[0].owner_name),
        title_number: check(form_pre_fill[0].title_number),
        height: check(form_pre_fill[0].height),
        unladen_weight: check(form_pre_fill[0].unladen_weight),
        serial_number: check(form_pre_fill[0].serial_number),
        ad_additional_notes: check(form_pre_fill[0].ad_additional_notes),
        cost: `${check(form_pre_fill[0].cost)}`,
        fair_market_value: check(form_pre_fill[0].fair_market_value),
        color: check(form_pre_fill[0].color),
        tire_info: check(form_pre_fill[0].tire_info),
        notes: '',
        bd_additional_notes: check(form_pre_fill[0].bd_additional_notes),
        status: check(form_pre_fill[0].status),
      };
    }

    if (form_pre_fill && state === 'Trailer' && !isPopUp) {
      fillValuesTrailer = {
        insurance: {
          id: form_pre_fill[0].insurance.id,
          company_name: check(form_pre_fill[0].insurance.company_name),
          policy_number: check(form_pre_fill[0].insurance.policy_number),
          insurance_expiration_date: check(
            form_pre_fill[0].insurance.insurance_expiration_date
          ),
          insurance_file: '',
        },
        license: {
          id: form_pre_fill[0].license.id,
          plate_number: check(form_pre_fill[0].license.plate_number),
          license_expiration_date: check(
            form_pre_fill[0].license.license_expiration_date
          ),
          registered_state: check(form_pre_fill[0].license.registered_state),
          inspection_date: check(form_pre_fill[0].license.inspection_date),
          license_file: '',
        },

        document: {
          id: form_pre_fill[0].document.id,
          document_name: check(form_pre_fill[0].document.document_name),
          file: '',
          description: check(form_pre_fill[0].document.description),
        },
        company: check(form_pre_fill[0].company),
        unit_number: check(form_pre_fill[0].unit_number),
        model: check(form_pre_fill[0].model),
        dispatcher: check(form_pre_fill[0].dispatcher),
        make: check(form_pre_fill[0].make),
        trailer_type: check(form_pre_fill[0].trailer_type),
        trailer_length: check(form_pre_fill[0].trailer_length),
        no_of_axle: check(form_pre_fill[0].no_of_axle),
        pd_additional_notes: check(form_pre_fill[0].pd_additional_notes),
        year_purchased: check(form_pre_fill[0].year_purchased),
        VIN: check(form_pre_fill[0].VIN),
        owner_name: check(form_pre_fill[0].owner_name),
        title_number: check(form_pre_fill[0].title_number),
        height: check(form_pre_fill[0].height),
        unladen_weight: check(form_pre_fill[0].unladen_weight),
        serial_number: check(form_pre_fill[0].serial_number),
        ad_additional_notes: check(form_pre_fill[0].ad_additional_notes),
        cost: `${check(form_pre_fill[0].cost)}`,
        fair_market_value: check(form_pre_fill[0].fair_market_value),
        color: check(form_pre_fill[0].color),
        tire_info: check(form_pre_fill[0].tire_info),
        notes: '',
        bd_additional_notes: '',
        status: check(form_pre_fill[0].status),
      };
    }

    console.log('pre', form_pre_fill);

    //  VALIDATION FOE DATE SETTING MAX AND MIN ---------------------------------------------------------(2022-03-13)
    function formatDate() {
      var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = '0' + month;

      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    }

    //  FORMIK YUP VALIDATION------------------------------------------------------------------
    const validation =
      state === 'Truck' && (loginRole === 'DM' || loginRole === 'TL')
        ? Yup.object({
            year_purchased: Yup.string().matches(
              /^19([8-9][0-9])|20([0-1][0-9])|202[0-2]$/,
              'Year should be between 1980 and 2022'
            ),

            fuel_type: Yup.string().required('Required'),
            owner_name: Yup.string().required('Required'),
            gross_weight: Yup.string().required('Required'),
            company: Yup.string().required('Required'),
            // dispatcher: Yup.string().required('Required'),
            driver: Yup.string().when('dispatcher', {
              is: (a) => a !== undefined,
              then: Yup.string().required('Please fill out Driver'),
            }),
          })
        : state === 'Trailer' && (loginRole === 'DM' || loginRole === 'TL')
        ? Yup.object({
            year_purchased: Yup.string().matches(
              /^19([8-9][0-9])|20([0-1][0-9])|202[0-2]$/,
              'Year should be between 1980 and 2022'
            ),
            company: Yup.string().required('Required'),
            // dispatcher: Yup.string().required('Required'),
          })
        : state === 'Truck'
        ? Yup.object({
            year_purchased: Yup.string().matches(
              /^19([8-9][0-9])|20([0-1][0-9])|202[0-2]$/,
              'Year should be between 1980 and 2022'
            ),
            company: Yup.string().required('Required'),
            fuel_type: Yup.string().required('Required'),
            owner_name: Yup.string().required('Required'),
            gross_weight: Yup.string().required('Required'),
          })
        : Yup.object({
            year_purchased: Yup.string().matches(
              /^19([8-9][0-9])|20([0-1][0-9])|202[0-2]$/,
              'Year should be between 1980 and 2022'
            ),
            company: Yup.string().required('Required'),
          });

    // Function Compares initial and new Form values and returns only newly added values----------------------------------------------
    let modifiedValues = {};
    const deepCompare = (values, initialValues, arg) => {
      const key1 = Object.keys(values);
      // const key2 = Object.keys(initialValues);

      for (const key of key1) {
        const val1 = values[key];
        const val2 = initialValues[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (areObjects) {
          console.log('val1', val1);
          deepCompare(val1, val2, key);
        } else if (!areObjects && val1 !== val2) {
          console.log('key', key);
          console.log('value', val1);
          if (typeof val1 === 'object') {
            if (key === 'file') {
              modifiedValues[`document.${key}`] = val1;
            } else {
              modifiedValues[`${key.split('_')[0]}.${key}`] = val1;
            }
          } else {
            modifiedValues[`${arg ? `${arg}.${key}` : key}`] = val1;
          }
        }
      }
      return modifiedValues;
    };

    function isObject(object) {
      return object !== null && typeof object === 'object';
    }
    // -----------------------------------------------------------------------------------------------------------------------------------

    // Function that takes object as argument and return all its keys as seperate array --------------------------------------------------
    const keyify = (obj, prefix = '') =>
      Object.keys(obj).reduce((res, el) => {
        if (Array.isArray(obj[el])) {
          return res;
        } else if (typeof obj[el] === 'object' && obj[el] !== null) {
          return [...res, ...keyify(obj[el], prefix + el + '.')];
        }
        return [...res, prefix + el];
      }, []);

    // Since file is object "keyify" fails to return file keys! So at line num 500 "tempKey  array is creted by spreading "keyify" values & adding file keys manually"

    //  ID Adder Adds ID to req body to patch files -------------------------------------------------------------------------------------------------------------

    function idAdder(obj) {
      for (let i = 0; i < Object.keys(obj).length; i++) {
        let item = Object.keys(obj)[i];
        if (item === 'document.file' && form_pre_fill[0].document.id) {
          obj[`${item.split('.')[0]}.id`] = form_pre_fill[0].document.id;
          break;
        } else if (
          item === 'insurance.insurance_file' &&
          form_pre_fill[0].insurance.id
        ) {
          obj[`${item.split('.')[0]}.id`] = form_pre_fill[0].insurance.id;
          break;
        } else if (
          item === 'license.license_file' &&
          form_pre_fill[0].license.id
        ) {
          obj[`${item.split('.')[0]}.id`] = form_pre_fill[0].license.id;
          break;
        }
      }
    }
    // Filter dropdown options for trailer and driver based on carrier field input---------------------------------------------------
    function trailerFilter(e, allTrailer, type = true) {
      form_pre_fill && type
        ? e === ''
          ? setTrailerID(allTrailer)
          : setTrailerID([
              { key: 'Select Trailer', value: '', company: '' },
              ...allTrailer.filter((item) =>
                item.company !== null
                  ? item.company.toString()
                  : item.company === e.toString()
              ),
            ])
        : e.target.value === ''
        ? setTrailerID(availableTrailer)
        : setTrailerID([
            { key: 'Select Trailer', value: '', company: '' },
            ...availableTrailer.filter((item) =>
              item.company !== null
                ? item.company.toString()
                : item.company === e.target.value.toString()
            ),
          ]);
    }
    function driverFilter(e, allDriver, type = true) {
      form_pre_fill && type
        ? e === ''
          ? setDriverID(allDriver)
          : setDriverID([
              { key: 'Select Driver', value: '', company: '' },
              ...allDriver.filter((item) =>
                item.company !== null
                  ? item.company.toString()
                  : item.company === e.toString()
              ),
            ])
        : e.target.value === ''
        ? setDriverID(availableDriver)
        : setDriverID([
            { key: 'Select Driver', value: '', company: '' },
            ...availableDriver.filter((item) =>
              item.company !== null
                ? item.company.toString()
                : item.company === e.target.value.toString()
            ),
          ]);
    }

    //--------------------------------------------------------------------------------------------------------------------------------

    return (
      <>
        <div className={style.center}>
          {console.log('typeProp', typeProp)}
          <Formik
            initialValues={
              state === 'Truck' && form_pre_fill
                ? fillValuesTruck
                : state === 'Trailer' && form_pre_fill && isPopUp
                ? trailerIntValue
                : state === 'Trailer' && form_pre_fill
                ? fillValuesTrailer
                : state === 'Truck'
                ? intValue
                : trailerIntValue
            }
            validationSchema={validation}
            onSubmit={(values) => {
              var formData = new FormData(); // Currently empty
              if (form_pre_fill && !isPopUp) {
                if (typeProp !== 'Trailer') {
                  let patchData = deepCompare(
                    values,
                    state === 'Truck' ? fillValuesTruck : fillValuesTrailer
                  );
                  console.log('patchData', patchData);
                  idAdder(patchData);

                  let entries = Object.entries(patchData);
                  Object.keys(patchData).map((key, i) =>
                    formData.append(key, entries[i][[1]])
                  );
                }
              } else {
                // tempkey has all keys of form values!
                let tempKey = [
                  ...keyify(values),
                  'license.license_file',
                  'insurance.insurance_file',
                  'document.file',
                ];
                // console.log('key', tempKey);
                // console.log('value', values);

                // Dynamically appending key and values to "formData"
                // Line 513 to 519 creating key values like Ex: "values.insurance[insurance_expiration_date]"
                tempKey.map((item, i) =>
                  formData.append(
                    tempKey[i],
                    item.split('.').length > 1 //checks for keys with step//
                      ? item.split('.')[0] === 'insurance'
                        ? values.insurance[item.split('.')[1]]
                        : item.split('.')[0] === 'license'
                        ? values.license[item.split('.')[1]]
                        : item.split('.')[0] === 'document'
                        ? values.document[item.split('.')[1]]
                        : ''
                      : values[item]
                  )
                );
              }
              //  Check for type of Form
              if (state === 'Truck') {
                form_pre_fill //Check for new or edit //
                  ? AxiosApi.patch(
                      `/equipments/truck/${form_pre_fill[0].id}/`,
                      formData
                    ).then((res) => {
                      dispatch(EquipmentAction.editTruck(res));
                      dispatch(EquipmentAction.setPreviewData(res));
                      dispatch(EquipmentAction.setType(state));
                      alertRef.current.showModel(); //Show Popup model //
                    })
                  : AxiosApi.post('/equipments/truck/', formData).then(
                      (res) => {
                        if (typeProp !== 'Dispatch_Truck') {
                          dispatch(EquipmentAction.postTruck(res.truck_data));
                          dispatch(
                            EquipmentAction.setPreviewData(res.truck_data)
                          );
                          dispatch(EquipmentAction.setType(state));
                        }
                        if (typeProp === 'Dispatch_Truck') {
                          callApiParent();
                        }

                        alertRef.current.showModel(); //Show Popup model //
                      }
                    );
              } else {
                form_pre_fill && !isPopUp //Check for new or edit //
                  ? AxiosApi.patch(
                      `/equipments/trailer/${form_pre_fill[0].id}/`,
                      formData,
                      {}
                    ).then((res) => {
                      dispatch(EquipmentAction.editTrailer(res));
                      dispatch(EquipmentAction.setPreviewData(res));
                      dispatch(EquipmentAction.setType(state));
                      alertRef.current.showModel(); //Show Popup model //
                    })
                  : AxiosApi.post('/equipments/trailer/', formData).then(
                      (res) => {
                        if (typeProp !== 'Trailer') {
                          dispatch(
                            EquipmentAction.postTrailer(res.trailer_data)
                          );
                          dispatch(
                            EquipmentAction.setPreviewData(res.trailer_data)
                          );
                          dispatch(EquipmentAction.setType(state));
                        }

                        if (typeProp === 'Trailer') {
                          callApiParent();
                        }
                        alertRef.current.showModel(); //Show Popup model //
                      }
                    );
              }
            }}
          >
            {({ setFieldValue, ...rest }) => (
              <Form id={style.formWrap}>
                <div id={style.title}>
                  <i
                    className="bx bx-left-arrow-alt bx-sm"
                    onClick={
                      typeProp === 'Trailer'
                        ? trailerFormHandler
                        : typeProp === 'Dispatch_Truck'
                        ? truckFormHandler
                        : handleback
                    }
                  ></i>
                  <h2>
                    {typeProp === 'Trailer'
                      ? 'Add new'
                      : form_pre_fill
                      ? 'Edit'
                      : 'Add new'}
                    {state}
                  </h2>
                </div>
                {/* -------------------------------------------START FIRST DIV TO TAKE CARRIER AND UNIT NUMBER--------------------------------------------------------- */}
                <main
                  id={`${
                    state === 'Truck' ? style.outerWrap : style.outerWrapTrailer
                  }`}
                >
                  <section className={` ${style.card} ${style.header}`}>
                    <div className={style.headerWrap}>
                      <FormTextfield
                        control="select"
                        label="Carrier*"
                        options={carrierName}
                        name="company"
                        onChange={(e) => {
                          rest.handleChange('company')(e);
                          trailerFilter(e, availableTrailer, false);
                          driverFilter(e, availableDriver, false);
                        }}
                      />

                      <FormTextfield
                        control="input"
                        label="Unit Number"
                        type="number"
                        min="0"
                        name="unit_number"
                        placeholder="Enter Unit Number"
                      />
                      {loginRole === 'DM' || loginRole === 'TL' ? (
                        <FormTextfield
                          control="select"
                          label="Dispatcher"
                          options={dispatcherName}
                          name="dispatcher"
                        />
                      ) : null}
                    </div>
                  </section>
                  {/* ----------------------------BASIC DETAILS CARD--------------------------------------------------------- */}
                  <section className={`${style.card} ${style.basic_details}`}>
                    <h4 className={style.hr}>Basic Details</h4>
                    <div className={style.fieldWrapFull}>
                      <FormTextfield
                        control="input"
                        name="model"
                        type="text"
                        placeholder="Type Model"
                        label="Model"
                      />
                      <FormTextfield
                        control="input"
                        type="text"
                        name="make"
                        placeholder="Type Make"
                        label="Make"
                      />
                      {/* display only for trailer */}
                      <div style={{ display: state === 'Truck' ? 'none' : '' }}>
                        <FormTextfield
                          control="select"
                          name="trailer_type"
                          label="Trailer type"
                          options={trailerOption}
                        />
                      </div>
                      {/* display only for trailer */}
                      <div style={{ display: state === 'Truck' ? 'none' : '' }}>
                        <FormTextfield
                          control="input"
                          name="trailer_length"
                          type="number"
                          min="0"
                          label="Trailer length(ft)"
                        />
                      </div>

                      {/* display only for truck*/}
                      <div
                        style={{ display: state === 'Trailer' ? 'none' : '' }}
                      >
                        <FormTextfield
                          control="input"
                          name="gross_weight"
                          type="number"
                          min="0"
                          placeholder="Enter Gross Weight"
                          label="Gross Weight(lbs)*"
                        />
                      </div>
                      {/* display only for truck */}
                      <div
                        style={{ display: state === 'Trailer' ? 'none' : '' }}
                      >
                        <FormTextfield
                          control="select"
                          name="fuel_type"
                          options={Fuel}
                          label="Fuel Type*"
                        />
                      </div>
                      <FormTextfield
                        control="input"
                        name="no_of_axle"
                        type="number"
                        min="0"
                        placeholder="Enter Number of Axles"
                        label="Number Of Axles"
                      />
                      <FormTextfield
                        control="select"
                        name="status"
                        options={selectOption}
                        placeholder="status"
                        label="Status"
                      />
                      <FormTextfield
                        control="textarea"
                        name="bd_additional_notes"
                        type="text"
                        placeholder="Additional Notes"
                        label="Additional Notes"
                      />
                    </div>
                  </section>
                  {/* ----------------------------START VEHIACAL DETAILS OR PURCHASED CARD--------------------------------------------------------- */}
                  <section className={`${style.card} ${style.vehicle_details}`}>
                    <h4 className={style.hr}>
                      {state === 'Truck'
                        ? 'Vehicle Details'
                        : 'Purchased Details'}
                    </h4>
                    <div className={style.fieldWrapFull}>
                      <FormTextfield
                        control="input"
                        type="number"
                        name="year_purchased"
                        placeholder="Select Year"
                        label="Purchased Year"
                      />
                      <FormTextfield
                        control="input"
                        name="VIN"
                        type="text"
                        placeholder="Enter VIN No."
                        label="VIN"
                      />
                      <FormTextfield
                        control="input"
                        type="text"
                        name="owner_name"
                        placeholder="Type Owner Name"
                        label="Owner*"
                      />
                      <FormTextfield
                        control="input"
                        name="title_number"
                        type="text"
                        placeholder="Enter Title No."
                        label="Title Number"
                      />
                      <FormTextfield
                        control="input"
                        name="height"
                        type="number"
                        min="0"
                        placeholder="Enter Equipment Height"
                        label="Height(ft)"
                      />
                      <FormTextfield
                        control="input"
                        name="unladen_weight"
                        type="number"
                        min="0"
                        placeholder="Enter Weight"
                        label="Unladen Weight(lbs)"
                      />
                      <FormTextfield
                        control="input"
                        name="serial_number"
                        type="text"
                        placeholder="Enter Number Here"
                        label="Serial Number"
                      />
                      <FormTextfield
                        control="textarea"
                        name="vd_additional_notes"
                        type="text"
                        placeholder="Additional Notes"
                        label="Additional Notes"
                      />
                    </div>
                  </section>
                  {/* ----------------------------START LICENSE CARD--------------------------------------------------------- */}
                  <section className={`${style.card} ${style.license}`}>
                    <h4 className={style.hr}>License</h4>
                    <div className={style.fieldWrapHalf}>
                      <FormTextfield
                        control="input"
                        name="license.plate_number"
                        type="text"
                        placeholder="Enter Plate No."
                        label="License Plate No."
                      />
                      <FormTextfield
                        control="input"
                        name="license.license_expiration_date"
                        type="date"
                        label="License Expiration"
                        min={formatDate()}
                      />
                      <FormTextfield
                        control="input"
                        name="license.inspection_date"
                        type="date"
                        label="Inspection Date"
                      />
                      <FormTextfield
                        control="select"
                        name="license.registered_state"
                        label="Registered State"
                        options={usaCities}
                      />
                      <FormTextfield
                        control="file"
                        name="license.license_file"
                        label="Upload document"
                        onChange={(event) => {
                          setFieldValue(
                            'license.license_file',
                            event.currentTarget.files[0]
                          );
                        }}
                      />
                    </div>
                  </section>
                  {/* ----------------------------START INSURANCE CARD--------------------------------------------------------- */}
                  <section className={`${style.card} ${style.insurance}`}>
                    <h4 className={style.hr}>Insurance</h4>
                    <div className={style.fieldWrapHalf}>
                      <FormTextfield
                        control="input"
                        name="insurance.company_name"
                        type="text"
                        placeholder="Type Company Name"
                        label="Insurance Company"
                      />
                      <FormTextfield
                        control="input"
                        name="insurance.policy_number"
                        type="number"
                        placeholder="Enter Poilcy Number"
                        label="Policy Number"
                        min="0"
                      />
                      <FormTextfield
                        control="input"
                        name="insurance.insurance_expiration_date"
                        type="date"
                        label="Insurance Expiration"
                        min={formatDate()}
                      />
                      <FormTextfield
                        control="file"
                        name="insurance.insurance_file"
                        label="Upload document"
                        onChange={(event) => {
                          setFieldValue(
                            'insurance.insurance_file',
                            event.target.files[0]
                          );
                        }}
                      />
                    </div>
                  </section>
                  {/* ----------------------------START ADDITIONAL DETAILS CARD--------------------------------------------------------- */}
                  <section
                    className={`${style.card} ${style.additional_details}`}
                  >
                    <h4 className={style.hr}>Additional Details</h4>
                    <div className={style.fieldWrapFull}>
                      <FormTextfield
                        control="input"
                        name="cost"
                        type="text"
                        label="Cost"
                        dolar="true"
                      />
                      <FormTextfield
                        control="input"
                        name="fair_market_value"
                        type="text"
                        label="FMV"
                        dolar="true"
                      />
                      <FormTextfield
                        control="input"
                        name="color"
                        type="text"
                        label="Color"
                        placeholder="Type Color"
                      />
                      <FormTextfield
                        control="input"
                        name="tire_info"
                        type="text"
                        placeholder="Enter Tire Info"
                        label="Tire Info"
                      />
                      <FormTextfield
                        control="textarea"
                        name="notes2"
                        type="text"
                        label="Additional Notes"
                        placeholder="Type Additional Notes"
                      />
                    </div>
                  </section>
                  {/* ----------------------------START UPLOAD OTHER DOCUMENT AND IMAGE CARD--------------------------------------------------------- */}
                  <section className={`${style.card} ${style.upload}`}>
                    <h4 className={style.hr}>Upload additional document</h4>
                    <div className={style.fieldWrapFull}>
                      <FormTextfield
                        control="input"
                        name="document.document_name"
                        placeholder="Document name"
                        label="Document name"
                      />
                      <FormTextfield
                        control="file"
                        name="document.document_file"
                        label="Upload document"
                        onChange={(e) => {
                          setFieldValue('document.file', e.target.files[0]);
                        }}
                      />

                      <FormTextfield
                        control="textarea"
                        name="document.document_description"
                        type="text"
                        label="Add description"
                        placeholder="Add description"
                      />
                    </div>
                  </section>

                  <section
                    className={`${style.card} ${style.assign}`}
                    style={{ display: state === 'Trailer' ? 'none' : '' }}
                  >
                    <h4 className={style.hr}>Assign Trailer and Driver</h4>
                    <div className={style.assignWrap}>
                      <FormTextfield
                        control="select"
                        label="Select Trailer"
                        options={trailerID}
                        name="trailer"
                        addNew={true}
                        clickHandler={trailerFormHandler}
                        fieldStyle={style.selectFieldAssign}
                      />

                      <FormTextfield
                        control="select"
                        label="Select Driver"
                        options={driverID}
                        name="driver"
                        addNew={true}
                        clickHandler={driverFormHandler}
                        fieldStyle={style.selectFieldAssign}
                      />
                    </div>
                  </section>

                  {/* ----------------------------START BUTTON CARD--------------------------------------------------------- */}
                  <section className={` ${style.button_section}`}>
                    <div className={style.button_wrap}>
                      <button
                        variant="outlined"
                        onClick={
                          typeProp === 'Trailer'
                            ? trailerFormHandler
                            : typeProp === 'Dispatch_Truck'
                            ? truckFormHandler
                            : handleback
                        }
                        type="reset"
                      >
                        Cancel
                      </button>
                      <AlertModel
                        type={`SAVE`}
                        title={`Succesfully added.`}
                        button1="Close"
                        button2="Okay!"
                        typeoff="submit"
                        ref={alertRef}
                        navigateTo={
                          typeProp === 'Trailer'
                            ? '#'
                            : typeProp === 'Dispatch_Truck'
                            ? '#'
                            : `/${
                                state === 'Truck' ? 'truck' : 'trailer'
                              }_details_preview`
                        }
                        handleOkay={
                          typeProp === 'Trailer'
                            ? trailerFormHandler
                            : typeProp === 'Dispatch_Truck'
                            ? truckFormHandler
                            : () => console.log('Successfully added')
                        }
                      />
                    </div>
                  </section>
                </main>
              </Form>
            )}
          </Formik>
        </div>
      </>
    );
  }
);

export default AddNewTrailer;
