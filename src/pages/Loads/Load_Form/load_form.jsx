import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import FormTextfield from '../../../components/Formfield/formikControl';
import Style from './loadForm.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import Texterror from '../../../components/Formfield/TextError/Texterror';
import { useNavigate } from 'react-router-dom';
import { loadBingApi, Microsoft } from './BingMapLoader.ts';
import { Modal, Box, Button } from '@mui/material';
// import Charges from '../../CreateLoad/loadForm/createLoad';
import Charges from './charges';

import useAxios from '../../../hooks/useAxios';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import AlertModel from '../../../components/modals/AlertModel';
import LoadAction from '../../../redux/actions/LoadAction';
import './mapStyle.css';
import * as Yup from 'yup';

const LoadForm = forwardRef(({ formHandler, handler }, ref) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const AxiosApi = useAxios();
  let preview = useSelector((state) => state.LoadReducer.loadPreviewData);
  console.log('preview', preview);
  // let newLoadInfo = useSelector((state) => state.LoadReducer.loadNum);

  const [choice, setChoice] = useState('Broker');
  const [indexVal, setIndexVal] = useState(0);
  const [indexValDrop, setIndexValDrop] = useState(0);
  const [pickUpIndex, setPickUpIndex] = useState(0);
  const [dropOffIndex, setDropOffIndex] = useState(0);
  const [wayPointsPickUp, setWayPointsPickUp] = useState([]);
  const [wayPoints, setWayPoints] = useState([]);
  const [wayPointsDrop, setWayPointsDrop] = useState([]);
  const [bingMiles, setBingMiles] = useState(0);
  const [carrier, setCarrier] = useState([{ key: 'Loading...', value: '' }]);
  const [broker, setBroker] = useState([{ key: 'Loading...', value: '' }]);
  const [others, setOthers] = useState([{ key: 'Loading...', value: '' }]);
  const [Miles, setMiles] = useState(0);
  const [popup_addnew, setpopup_addnew] = useState(false);
  const [total_amount, setTotal_amount] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  // const [options, setOptions] = useState(
  //   newLoadInfo?.accessorial || newLoadInfo
  // );
  const [new_load_no, setNew_load_no] = useState(
    preview ? preview.load_no : ''
  );
  const [charges_options, setCharges_options] = useState('');

  // Preview------------------------------------------------------------------------------------------------------------------------
  // console.log('newLoad', newLoadInfo);
  console.log('waypoints', wayPoints);
  console.log('new_load', new_load_no);

  function percentage(partialValue, totalValue) {
    console.log('par', partialValue);
    console.log('tot', totalValue);
    console.log(Math.abs(+partialValue * +totalValue) / 100);
    return Math.abs((+partialValue * +totalValue) / 100);
  }

  function simpleArraySum(ar) {
    var sum = 0;
    for (var i = 0; i < ar.length; i++) {
      if (ar[i] !== undefined) {
        sum += ar[i];
      }
    }
    return parseFloat(sum);
  }

  // let previewValues;
  let initialValue;
  if (preview) {
    initialValue = {
      id: preview.id,
      load_no: preview.load_no,
      reference: preview.reference,
      carrier: checkForNull(preview.carrier),
      others: checkForNull(preview.others),
      broker: checkForNull(preview.broker),
      account_no: checkForNull(preview.account_no),
      status: preview.status,
      creation_datetime:
        preview.creation_datetime !== null
          ? dayjs(preview.creation_datetime).format('YYYY-MM-DDTHH:mm')
          : '',
      drop_trailer: checkForNull(preview.drop_trailer),
      trailer_type: preview.trailer_type,
      load_type: preview.load_type,
      total_mile: checkForNull(preview.total_mile),
      miles_type: preview.miles_type,
      shipper: { name: preview.shipper.name },
      consignee: { name: preview.consignee.name },
      pickup_location: [
        ...preview.pickup_location.map((item) => ({
          address: {
            line_1: item.address.line_1,
            line_2: item.address.line_2,
            city: item.address.city,
            state: item.address.state,
            zipcode: item.address.zipcode,
            id: item.address.id,
          },
          // date: item.date,
          start_time:
            item.start_time !== null
              ? dayjs(item.start_time).format('YYYY-MM-DDTHH:mm')
              : '',
          end_time:
            item.end_time !== null
              ? dayjs(item.end_time).format('YYYY-MM-DDTHH:mm')
              : '',
          contact_name: checkForNull(item.contact_name),
          contact_phone: checkForNull(item.contact_phone),
          instruction: checkForNull(item.instruction),
          bol: item.bol,
          reference: item.reference,
          id: item.id,
          shipper: item.shipper,
          load: item.load,
        })),
      ],

      dropoff_location: [
        ...preview.dropoff_location.map((item) => ({
          address: {
            line_1: item.address.line_1,
            line_2: item.address.line_2,
            city: item.address.city,
            state: item.address.state,
            zipcode: item.address.zipcode,
            id: item.address.id,
          },
          // date: item.date,
          start_time:
            item.start_time !== null
              ? dayjs(item.start_time).format('YYYY-MM-DDTHH:mm')
              : '',
          end_time:
            item.end_time !== null
              ? dayjs(item.end_time).format('YYYY-MM-DDTHH:mm')
              : '',
          contact_name: checkForNull(item.contact_name),
          contact_phone: checkForNull(item.contact_phone),
          instruction: checkForNull(item.instruction),
          bol: item.bol,
          id: item.id,
          consignee: item.consignee,
          load: item.load,
          // reference: item.reference,
        })),
      ],
      freight_details: [
        ...preview.freight_details.map((item) => ({
          description: item.description,
          weight: checkForNull(item.weight),
          weight_unit_name: item.weight_unit_name,
          dimensions_unit: item.dimensions_unit,
          length: checkForNull(item.length),
          width: checkForNull(item.width),
          height: checkForNull(item.height),
          quantity: checkForNull(item.quantity),
          quantity_type_name: item.quantity_type_name,
          declared_value: checkForNull(item.declared_value),
          comment: item.comment,
          id: item.id,
          load: item.load,
        })),
      ],
      charges: {
        hauling_fee: {
          type: preview.charges?.hauling_fee?.type,
          rate: checkForNull(preview.charges?.hauling_fee?.rate),
          amount: checkForNull(preview.charges?.hauling_fee?.amount),
          id: checkForNull(preview.charges?.hauling_fee?.id),
          load: checkForNull(preview.charges?.hauling_fee?.load),
        },
        fuel_surcharge: {
          type: preview.charges?.fuel_surcharge?.type,
          rate: checkForNull(preview.charges?.fuel_surcharge?.rate),
          amount: checkForNull(preview.charges?.fuel_surcharge?.amount),
          id: checkForNull(preview.charges?.fuel_surcharge?.id),
          load: checkForNull(preview.charges?.fuel_surcharge?.load),
        },
        accessorial_fee: [
          ...preview.charges?.accessorial_fee.map((item) => ({
            type: item?.type?.id,
            rate: checkForNull(item.rate),
            amount: checkForNull(item.amount),
            id: item?.id,
            load: item?.load,
          })),
        ],
        accessorial_deductions: [
          ...preview.charges?.accessorial_deductions.map((item) => ({
            type: item.type?.id,
            rate: checkForNull(item.rate),
            amount: checkForNull(item.amount),
            id: item?.id,
            load: item?.load,
          })),
        ],
        discount: {
          type: preview.charges?.discount?.type,
          rate: checkForNull(preview.charges?.discount?.rate),
          amount: checkForNull(preview.charges?.discount?.amount),
          id: checkForNull(preview.charges?.discount?.id),
          // load: checkForNull(preview.charges?.discount?.load),
        },
        total_amount: '',
      },
    };
  } else {
    initialValue = {
      load_no: '',
      reference: '',
      carrier: '',
      others: '',
      broker: '',
      account_no: '',
      status: '',
      creation_datetime: '',
      drop_trailer: false,
      trailer_type: '',
      load_type: '',
      total_mile: '',
      miles_type: 'manual',
      shipper: {
        name: '',
      },
      consignee: {
        name: '',
      },
      pickup_location: [
        {
          address: {
            line_1: '',
            line_2: '',
            city: '',
            state: '',
            zipcode: '',
          },

          start_time: '',
          end_time: '',
          contact_name: '',
          contact_phone: '',
          pickup_instruction: '',
          bol: '',
          reference: '',
        },
      ],

      dropoff_location: [
        {
          address: {
            line_1: '',
            line_2: '',
            city: '',
            state: '',
            zipcode: '',
          },

          start_time: '',
          end_time: '',
          contact_name: '',
          contact_phone: '',
          drop_instruction: '',
          bol: '',
          // reference: '',
          notes: '',
        },
      ],
      freight_details: [
        {
          description: '',
          weight: '',
          weight_unit_name: '',
          dimensions_unit: '',
          length: '',
          width: '',
          height: '',
          quantity: '',
          quantity_type_name: '',
          declared_value: '',
          comment: '',
        },
      ],
      charges: {
        hauling_fee: {
          type: '',
          rate: '',
          amount: '',
        },
        fuel_surcharge: {
          type: '',
          rate: '',
          amount: '',
        },
        accessorial_fee: [
          {
            type: '',
            rate: '',
            amount: '',
          },
        ],
        accessorial_deductions: [
          {
            type: '',
            rate: '',
            amount: '',
          },
        ],
        discount: {
          type: '',
          rate: '',
          amount: '',
        },
        total_amount: '',
      },
    };
  }

  // const [chargesData, setChargesData] = useState('');
  const mapRef = useRef();
  // const chargesRef = useRef();
  const loadRef = useRef();
  const alertRef = useRef();

  let [destination1, setDestination1] = useState({
    address: {
      addressLine: '',
      adminDistrict: '',
      countryRegion: '',
      countryRegionISO2: '',
      district: '',
      formattedAddress: '',
      locality: '',
      postalCode: '',
    },
    lat: null,
    long: null,
  });

  let [destination2, setDestination2] = useState({
    address: {
      addressLine: '',
      adminDistrict: '',
      countryRegion: '',
      countryRegionISO2: '',
      district: '',
      formattedAddress: '',
      locality: '',
      postalCode: '',
    },
    lat: null,
    long: null,
  });

  // Carrier Drop Down-----------------------------------------------------------------------------------------------------------
  let Name = [{ key: 'Select carrier name', value: '' }];
  let carrierCount = 0;
  async function callCarrierApi() {
    carrierCount = carrierCount + 1;
    await AxiosApi('/company/carrier/')
      .then((res) => {
        res.map((data) => Name.push({ key: data.name, value: data.id }));
      })
      .catch((err) => {
        if (carrierCount < 2) {
          toast.error('Reconnecting...');
          callCarrierApi();
        }
      });
  }
  // Boker Drop Down-------------------------------------------------------------------------------------------------------------------------------
  let brokerName = [{ key: 'Select Broker name', value: '' }];
  let brokerCount = 0;
  async function callBrokerApi() {
    brokerCount = brokerCount + 1;
    await AxiosApi('/company/broker/')
      .then((res) => {
        res.map((data) =>
          brokerName.push({ key: data.company_name, value: data.id })
        );
      })
      .catch((err) => {
        if (brokerCount < 2) {
          toast.error('Reconnecting...');
          callBrokerApi();
        }
      });
  }
  // Others Drop Down-------------------------------------------------------------------------------------------------------------------
  let othersName = [{ key: 'Select Others name', value: '' }];
  let othersCount = 0;
  async function callOthersApi() {
    othersCount = othersCount + 1;
    await AxiosApi('/company/others/')
      .then((res) => {
        res.map((data) =>
          othersName.push({ key: data.company_name, value: data.id })
        );
      })
      .catch((err) => {
        if (othersCount < 2) {
          toast.error('Reconnecting...');
          callOthersApi();
        }
      });
  }

  useEffect(() => {
    callCarrierApi().then(() => setCarrier(Name));
    callBrokerApi().then(() => setBroker(brokerName));
    callOthersApi().then(() => setOthers(othersName));
    // calculateTotalOnly();
    calculateTotal();
    // getPreviewData();
  }, []);
  // ---------------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    loadBingApi(process.env.REACT_APP_API_KEY).then(() => {
      initMap();
    });
  }, [destination2, destination1]);

  //Imperative handle  --------------------------------------------------------------------------------------------------------------------------

  useImperativeHandle(ref, () => ({
    callBrokerHandler() {
      callBrokerApi().then(() => setBroker(brokerName));
    },
    callOthersHandler() {
      callOthersApi().then(() => setOthers(othersName));
    },
  }));
  // useEffect(()=>{
  //  if(chargesData){

  //  }
  // },[chargesData])

  useEffect(() => {
    if (wayPointsPickUp.length > 0 && wayPointsDrop.length > 0) {
      setWayPoints([...wayPointsPickUp, ...wayPointsDrop]);
      return;
    }
    if (wayPointsPickUp.length > 0) {
      setWayPoints([...wayPointsPickUp]);
      return;
    }
    if (wayPointsDrop.length > 0) {
      setWayPoints([...wayPointsDrop]);
      return;
    }
  }, [wayPointsPickUp, wayPointsDrop]);

  useEffect(() => {
    // if (formikVal) {
    console.log(destination1);
    if (destination1.address.postalCode) {
      loadRef.current?.setFieldValue(
        `pickup_location[${indexVal}].address.line_1`,
        destination1.address.formattedAddress || ''
      );
      loadRef.current?.setFieldValue(
        `pickup_location[${indexVal}].address.zipcode`,
        destination1.address.postalCode || ''
      );
      loadRef.current?.setFieldValue(
        `pickup_location[${indexVal}].address.city`,
        destination1.address.locality || ''
      );
      loadRef.current?.setFieldValue(
        `pickup_location[${indexVal}].address.state`,
        destination1.address.adminDistrict || ''
      );

      let indexValue = -1;
      wayPointsPickUp.forEach((item, index) =>
        item.index === indexVal ? (indexValue = index) : null
      );

      if (indexValue === -1) {
        setWayPointsPickUp((prev) => [
          ...prev,
          {
            address: destination1.address.formattedAddress,
            index: indexVal,
            lat: destination1.lat,
            long: destination1.long,
          },
        ]);
      } else {
        setWayPointsPickUp((prev) => {
          let temp = [...prev];
          temp[indexValue] = {
            address: destination1.address.formattedAddress,
            index: indexVal,
            lat: destination1.lat,
            long: destination1.long,
          };
          return temp;
        });
      }
    }
  }, [destination1]);

  useEffect(() => {
    if (destination2.address.postalCode) {
      loadRef.current?.setFieldValue(
        `dropoff_location[${indexValDrop}].address.line_1`,
        destination2.address.formattedAddress || ''
      );
      loadRef.current?.setFieldValue(
        `dropoff_location[${indexValDrop}].address.zipcode`,
        destination2.address.postalCode || ''
      );
      loadRef.current?.setFieldValue(
        `dropoff_location[${indexValDrop}].address.city`,
        destination2.address.locality || ''
      );
      loadRef.current?.setFieldValue(
        `dropoff_location[${indexValDrop}].address.state`,
        destination2.address.adminDistrict || ''
      );

      let indexValue = -1;
      wayPointsDrop.forEach((item, index) =>
        item.index === indexValDrop ? (indexValue = index) : null
      );

      if (indexValue === -1) {
        setWayPointsDrop((prev) => [
          ...prev,
          {
            address: destination2.address.formattedAddress,
            index: indexValDrop,
            lat: destination2.lat,
            long: destination2.long,
          },
        ]);
      } else {
        setWayPointsDrop((prev) => {
          let temp = [...prev];
          temp[indexValue] = {
            address: destination2.address.formattedAddress,
            index: indexValDrop,
            lat: destination2.lat,
            long: destination2.long,
          };
          return temp;
        });
      }
    }
  }, [destination2]);

  function selectedSuggestion1(suggestionResult) {
    setDestination1({
      address: suggestionResult.address,
      lat: suggestionResult.location.latitude,
      long: suggestionResult.location.longitude,
    });
  }

  function selectedSuggestion2(suggestionResult) {
    // Input Field 2
    setDestination2({
      address: suggestionResult.address,
      lat: suggestionResult.location.latitude,
      long: suggestionResult.location.longitude,
    });
  }

  function userCurrentLocation(map) {
    // Map Initial View

    navigator.geolocation.getCurrentPosition(function (position) {
      var loc = new Microsoft.Maps.Location(
        position.coords.latitude,
        position.coords.longitude
      );
      // console.log(loc);

      var pin = new Microsoft.Maps.Pushpin(loc);
      map.entities.push(pin);

      map.setView({ center: loc, zoom: 30 });
    });
  }

  function initDirection() {
    var map = new Microsoft.Maps.Map(mapRef.current);

    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function (e) {
      // Feed Details of Truck and load type and get directions
      var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(
        map
      );

      directionsManager.setRenderOptions({
        itineraryContainer: document.getElementById('printoutPanel'),
      });

      directionsManager.setRequestOptions({
        // routeMode : driving/truck/transit/walking
        routeMode: Microsoft.Maps.Directions.RouteMode.truck,

        vehicleSpec: {
          dimensionUnit: 'ft',
          weightUnit: 'lb',
          vehicleHeight: 5,
          vehicleWidth: 3.5,
          vehicleLength: 30,
          vehicleWeight: 30000,
          vehicleAxles: 3,
          vehicleTrailers: 2,
          vehicleSemi: true,
          vehicleMaxGradient: 10,
          vehicleMinTurnRadius: 15,
          vehicleAvoidCrossWind: true,
          vehicleAvoidGroundingRisk: true,
          vehicleHazardousMaterials: 'F',
          vehicleHazardousPermits: 'F',
        },

        //  To calculate the number of routes max 3
        maxRoutes: 3,

        //For Distance unit Change (km, miles)
        distanceUnit: Microsoft.Maps.Directions.DistanceUnit.miles,
      });

      wayPoints.map((item) => {
        var wp = new Microsoft.Maps.Directions.Waypoint({
          address: item.address,
          // location: new Microsoft.Maps.Location(item.lat, item.long),
        });

        directionsManager.addWaypoint(wp);
      });

      // Calculates directions based on waypoints
      directionsManager.calculateDirections();

      // This will help to Handle Distance and Time
      // addHandler(target:object, eventName:string, handler:function)
      // eventName are predefined
      Microsoft.Maps.Events.addHandler(
        directionsManager,
        'directionsUpdated',
        calculateTimeDistance
      );
      Microsoft.Maps.Events.addHandler(
        directionsManager,
        'directionsError',
        calculateTimeDistanceError
      );

      // To calculate Distance and Time
      function calculateTimeDistance(e) {
        //Get the current route index.
        var routeIdx = directionsManager.getRequestOptions().routeIndex;

        //Get the distance of the route, rounded to 2 decimal places.
        var distance = Math.round(
          (e.routeSummary[routeIdx].distance * 100) / 100
        );

        console.log(distance);
        setBingMiles(distance);

        //Get the distance units used to calculate the route.
        var units = directionsManager.getRequestOptions().distanceUnit;

        var distanceUnits = '';

        if (units === Microsoft.Maps.Directions.DistanceUnit.km) {
          //If in kilometers
          distanceUnits = 'km';
        } else {
          //If in miles
          distanceUnits = 'miles';
        }

        //Time is in seconds, convert to minutes and round off.
        // var time = Math.round(e.routeSummary[routeIdx].timeWithTraffic / 60);

        // Hours are extracted
        // var time_hrs = Math.trunc(time / 60);

        // Minutes Are Extracted
        // var time_min = Math.round(time % 60);

        // document.getElementById('map_distance').innerHTML =
        //   'Distance: ' +
        //   distance +
        //   ' ' +
        //   distanceUnits +
        //   '<br/>Time with Traffic : ' +
        //   (time_hrs > 0 ? time_hrs + ' hr ' : '') +
        //   (time_min > 0 ? time_min + ' min ' : '');
      }

      // to handle Error
      function calculateTimeDistanceError(e) {
        alert('Error: ' + e.message + '\r\nResponse Code: ' + e.responseCode);
      }
    });
  }

  // -------------------------------------------------------------------------------------------------------------------------------------
  function initMap(prop) {
    // Map Initialize
    var map = new Microsoft.Maps.Map(mapRef.current);

    // TO fetch current location at interval of 3000 milisec.
    // setInterval(()=>{
    //   userCurrentLocation(map)
    // },3000)

    userCurrentLocation(map);

    // -------------------------------------------------------------------------------------------------------------------------------------------

    Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () {
      // Autosuggest feature
      var manager1;
      var manager2;
      console.log('prop', prop);
      if (prop === undefined) {
        manager1 = new Microsoft.Maps.AutosuggestManager({
          maxResults: 5,
          businessSuggestions: true,
          map: map,
        });

        manager1.attachAutosuggest(
          '.pickup_location_line_1',
          '.pickup_location_container',
          selectedSuggestion1
        );
        manager2 = new Microsoft.Maps.AutosuggestManager({
          maxResults: 5,
          businessSuggestions: true,
          map: map,
        });
        manager2.attachAutosuggest(
          '.dropoff_location_line_1',
          '.drop_location_container',
          selectedSuggestion2
        );
      }
      if (prop === 'drop') {
        manager2 = new Microsoft.Maps.AutosuggestManager({
          maxResults: 5,
          businessSuggestions: true,
          map: map,
        });
        manager2.attachAutosuggest(
          '.dropoff_location_line_1',
          '.drop_location_container',
          selectedSuggestion2
        );
      }

      if (prop === 'pick') {
        manager1 = new Microsoft.Maps.AutosuggestManager({
          maxResults: 5,
          businessSuggestions: true,
          map: map,
        });

        manager1.attachAutosuggest(
          '.pickup_location_line_1',
          '.pickup_location_container',
          selectedSuggestion1
        );
      }
    });
  }

  // -------------------------------------------------------------------------------------------------------------------------------

  const handleback = () => {
    // dispatch(EquipmentAction.resetForm());
    // navigate('/load/loadTable');
    navigate(-1);
  };

  function checkForNull(input) {
    return input === null ? '' : input;
  }

  const pickUp = {
    address: {
      line_1: '',
      line_2: '',
      city: '',
      state: '',
      zipcode: '',
    },

    start_time: '',
    end_time: '',
    contact_name: '',
    contact_phone: '',
    instruction: '',
    bol: '',
    reference: '',
  };

  const freight = {
    description: '',
    weight: '',
    weight_unit_name: '',
    dimensions_unit: '',
    length: '',
    width: '',
    height: '',
    quantity: '',
    quantity_type_name: '',
    declared_value: '',
    comment: '',
  };
  const quantity_options = [
    { value: '', key: 'Select' },
    { value: 'box', key: 'Box(es)' },
    { value: 'bundle', key: 'Bundle(s)' },
    { value: 'bushel', key: 'Bushel(s)' },
    { value: 'case', key: 'Case(s)' },
    { value: 'crate', key: 'Crate(s)' },
    { value: 'gallon', key: 'Gallon(s)' },
    { value: 'pallet', key: 'Pallet(s)' },
    { value: 'piece', key: 'Piece(s)' },
    { value: 'unit', key: 'Unit(s)' },
  ];

  const weight_unit = [
    { value: '', key: 'Select' },
    { value: 'lbs', key: 'lbs' },
    { value: 'tons', key: 'tons' },
    { value: 'kgs', key: 'kg' },
  ];
  const dimension = [
    { value: '', key: 'Select' },
    { value: 'ft', key: 'Ft' },
    { value: 'in', key: 'in' },
  ];
  const TrailerType = [
    { value: '', key: 'Select' },
    { value: 'dry_van', key: 'Dry Van' },
    { value: 'reefer', key: 'Reefer' },
    { value: 'flat_bed', key: 'Flat Bed' },
    { value: 'step_deck', key: 'Step Deck' },
    { value: 'low_boy', key: 'Low Boy' },
    { value: 'box_truck', key: 'Box Truck' },
  ];
  const loadType = [
    { value: '', key: 'Select' },
    { value: 'hazmat', key: 'Hazmat' },
    { value: 'oversize_load', key: 'OverSize Load' },
    { value: 'reefer', key: 'Reefer' },
    { value: 'tanker', key: 'Tanker' },
  ];
  // Yup.addMethod(Yup.string, 'stripEmptyString', function () {
  //   return this.transform((value) => (value === '' ? null : value));
  // });

  //Charges Update on Miles Change -----------------------------------------------------------------------------------------
  useEffect(() => {
    if (bingMiles) {
      setMiles(+bingMiles);
      loadRef.current?.setFieldValue('total_mile', +bingMiles);
    }
  }, [bingMiles, loadRef]);

  useEffect(() => {
    if (preview) {
      setMiles(preview.total_mile);
      // setWayPoints([
      //   ...preview.pickup_location.map((item, index) => ({
      //     address: item.address.line_1,
      //     index: index,
      //   })),
      //   ...preview.dropoff_location.map((item, index) => ({
      //     address: item.address.line_1,
      //     index: index + preview.pickup_location.length,
      //   })),
      // ]);
      setWayPointsPickUp([
        ...preview.pickup_location.map((item, index) => ({
          address: item.address.line_1,
          index: index,
        })),
      ]);
      setWayPointsDrop([
        ...preview.dropoff_location.map((item, index) => ({
          address: item.address.line_1,
          index: index,
        })),
      ]);
    }
  }, [preview]);

  useEffect(() => {
    loadRef.current.setFieldValue(
      'charges.hauling_fee.amount',
      loadRef.current?.values.charges.hauling_fee.type === 'per_mile'
        ? loadRef.current?.values.charges.hauling_fee.rate * Miles
        : loadRef.current?.values.charges.hauling_fee.type === 'flat_fee'
        ? +loadRef.current?.values.charges.hauling_fee.rate > 0
          ? +loadRef.current?.values.charges.hauling_fee.rate
          : 0
        : ''
    );

    loadRef.current.setFieldValue(
      'charges.fuel_surcharge.amount',
      loadRef.current?.values.charges.fuel_surcharge.type === 'percentage'
        ? percentage(loadRef.current?.values.charges.fuel_surcharge.rate, Miles)
        : loadRef.current?.values.charges.fuel_surcharge.type === 'flat_fee'
        ? +loadRef.current?.values.charges.fuel_surcharge.rate > 0
          ? +loadRef.current?.values.charges.fuel_surcharge.rate
          : 0
        : ''
    );
  }, [Miles]);

  useEffect(() => {
    loadRef.current.setFieldValue(
      'charges.discount.amount',
      loadRef.current?.values.charges.discount.type === 'percentage'
        ? percentage(loadRef.current?.values.charges.discount.rate, totalAmount)
        : loadRef.current?.values.charges.discount.type === 'flat_fee'
        ? +loadRef.current?.values.charges.discount.rate > 0
          ? +loadRef.current?.values.charges.discount.rate
          : 0
        : ''
    );
  }, [totalAmount]);

  // -----------------------------------------------------------------------------------------------------------------------------------
  function returnNull(value) {
    return value === '' ? null : value;
  }

  const validation = Yup.object().shape({
    carrier: Yup.string().required('Required'),
    broker: choice === 'Broker' ? Yup.string().required('Required') : '',
    others: choice === 'Others' ? Yup.string().required('Required') : '',
    creation_datetime: Yup.string().required('Required'),
    total_mile: Yup.string().required('Required'),
    shipper: Yup.object({
      name: Yup.string().required('Required'),
    }),
    consignee: Yup.object({
      name: Yup.string().required('Required'),
    }),
    pickup_location: Yup.array().of(
      Yup.object().shape({
        address: Yup.object({
          line_1: Yup.string().required('Required'),
        }),
        contact_phone: Yup.string().required('Required'),
        start_time: Yup.string().required('Start Time Required'),
        contact_name: Yup.string().required('Required'),
      })
    ),
    dropoff_location: Yup.array().of(
      Yup.object().shape({
        address: Yup.object({
          line_1: Yup.string().required('Required'),
        }),
        contact_phone: Yup.string().required('Required'),
        start_time: Yup.string().required('Start Time Required'),
        contact_name: Yup.string().required('Required'),
      })
    ),
  });

  function handleDraft(values) {
    let draftValue = { ...values };
    draftValue.total_mile = returnNull(values.total_mile);
    draftValue.miles_type = values.miles_type;
    draftValue.creation_datetime =
      values.creation_datetime === ''
        ? null
        : dayjs(values.load_creation_date).format();
    draftValue.account_no = returnNull(values.account_no);
    draftValue.pickup_location = values.pickup_location.map((item) => ({
      ...item,
      start_time:
        item.start_time === '' ? null : dayjs(item.start_time).format(),
      end_time: item.end_time === '' ? null : dayjs(item.end_time).format(),
    }));
    draftValue.dropoff_location = values.dropoff_location.map((item) => ({
      ...item,
      start_time:
        item.start_time === '' ? null : dayjs(item.start_time).format(),
      end_time: item.end_time === '' ? null : dayjs(item.end_time).format(),
    }));
    draftValue.freight_details = values.freight_details.map((item) => ({
      ...item,
      length: returnNull(item.length),
      width: returnNull(item.width),
      height: returnNull(item.height),
      weight: returnNull(item.weight),
      declared_value: returnNull(item.declared_value),
      quantity: returnNull(item.quantity),
    }));
    draftValue.status = 'draft';

    draftValue.charges = {
      hauling_fee: {
        type: values.charges.hauling_fee.type,
        rate: returnNull(values.charges.hauling_fee.rate),
        amount: returnNull(values.charges.hauling_fee.amount),
      },
      fuel_surcharge: {
        type: values.charges.fuel_surcharge.type,
        rate: returnNull(values.charges.fuel_surcharge.rate),
        amount: returnNull(values.charges.fuel_surcharge.amount),
      },
      accessorial_fee: [
        ...values.charges.accessorial_fee.map((item) => ({
          ...item,
          rate: returnNull(item.rate),
          amount: returnNull(item.amount),
          type: returnNull(item?.type),
        })),
      ],
      accessorial_deductions: [
        ...values.charges.accessorial_deductions.map((item) => ({
          ...item,
          rate: returnNull(item.rate),
          amount: returnNull(item.amount),
          type: returnNull(item?.type),
        })),
      ],
      discount: {
        type: values.charges.discount.type,
        rate: returnNull(values.charges.discount.rate),
        amount: returnNull(values.charges.discount.amount),
      },
    };

    console.log(draftValue);
    if (total_amount) {
      preview
        ? AxiosApi.patch(`/load/load/${preview.id}/`, draftValue).then(
            (res) => {
              dispatch(LoadAction.setEditLoad(res));
              alertRef.current.showModel();
            }
          )
        : AxiosApi.post('/load/load/', draftValue).then((res) => {
            dispatch(LoadAction.setAddNewLoad(res));
            if (res.message) {
              alertRef.current.setTitle(
                `Your Updated Load No is ${res.message.substring(
                  res.message.indexOf(':') + 1
                )}`
              );
            }
            alertRef.current.showModel();
          });
    }
  }

  // Calculate total Amount -------------------------------------------------------------------------------

  function calculateTotal(val) {
    console.log('value to add/sub', val);
    let total = parseFloat(
      parseFloat(
        loadRef.current.values.charges?.fuel_surcharge.amount === ''
          ? 0
          : loadRef.current.values.charges?.fuel_surcharge.amount
      ) +
        parseFloat(
          loadRef.current.values.charges?.hauling_fee.amount === '' ||
            loadRef.current.values.charges?.hauling_fee.amount === undefined
            ? 0
            : loadRef.current.values.charges?.hauling_fee.amount
        ) +
        parseFloat(
          simpleArraySum(
            loadRef.current.values.charges?.accessorial_fee.map(
              (item) => item.amount
            )
          ) === ''
            ? 0
            : simpleArraySum(
                loadRef.current.values.charges?.accessorial_fee.map(
                  (item) => item.amount
                )
              )
        ) -
        parseFloat(
          simpleArraySum(
            loadRef.current.values.charges?.accessorial_deductions.map(
              (item) => item.amount
            )
          ) === ''
            ? 0
            : simpleArraySum(
                loadRef.current.values.charges?.accessorial_deductions.map(
                  (item) => item.amount
                )
              )
        )
    ).toFixed(2);
    if (val) {
      total = total - val;
    }
    console.log('total', total);

    setTotalAmount(total);

    if (loadRef.current.values?.charges?.discount?.type === 'percentage') {
      let newTotal =
        total -
        +parseFloat(
          percentage(loadRef.current.values.charges.discount.rate, total)
        ).toFixed(2);

      loadRef.current.setFieldValue('charges.total_amount', newTotal);

      loadRef.current.setFieldValue(
        'charges.discount.amount',
        +parseFloat(
          percentage(loadRef.current.values.charges.discount.rate, total)
        ).toFixed(2)
      );
      if (newTotal < 0) {
        setTotal_amount(0);
      } else {
        setTotal_amount(1);
      }
    } else if (loadRef.current.values?.charges?.discount?.type === 'flat_fee') {
      let newTotal = total - +loadRef.current.values.charges.discount.rate;

      loadRef.current.setFieldValue('charges.total_amount', newTotal);

      loadRef.current.setFieldValue(
        'charges.discount.amount',
        +loadRef.current.values.charges.discount.rate
      );
      if (newTotal < 0) {
        setTotal_amount(0);
      } else {
        setTotal_amount(1);
      }
    } else {
      if (total < 0) {
        setTotal_amount(0);
      } else {
        setTotal_amount(1);
      }
    }
  }

  function clearPreview() {
    dispatch(LoadAction.setPreview(''));
  }

  useEffect(() => {
    return clearPreview;
  }, []);

  const validation_accessorial = Yup.object().shape({
    name: Yup.string().required('Required'),
  });

  const handleCarrierChange = (id) => {
    if (id === '') {
      setNew_load_no('');
    } else {
      AxiosApi(`load/load/new_load/?carrier=${id}`).then((res) => {
        console.log(res);
        loadRef.current?.setFieldValue('load_no', res.load_no);
        setNew_load_no(res.load_no);
        setCharges_options(res.accessorial);
      });
    }
  };

  return (
    <>
      <Formik
        initialValues={{ name: '', description: '' }}
        validationSchema={validation_accessorial}
        onSubmit={(values, { resetForm }) => {
          let addnew = { ...values };
          addnew.description = returnNull(values.description);
          AxiosApi.post('/load/accessorial_fee/', addnew).then((res) => {
            // setOptions([...options, res]);
            resetForm();
            setpopup_addnew(false);
          });
        }}
      >
        {(formik) => (
          <Modal open={popup_addnew}>
            <Box className={Style.box}>
              <h2>Add new option</h2>
              <Form>
                <div className={Style.boxWrap}>
                  <FormTextfield name="name" label="Name*" control="input" />
                  <FormTextfield
                    name="description"
                    label="Description"
                    control="textarea"
                  />
                </div>
                <button type="submit" id={Style.add_option_button}>
                  ADD
                </button>

                <i
                  className="bx bx-x bx-sm"
                  id={Style.close_add_option}
                  onClick={() => {
                    setpopup_addnew(false);
                    formik.resetForm();
                  }}
                ></i>
              </Form>
            </Box>
          </Modal>
        )}
      </Formik>
      <Formik
        innerRef={loadRef}
        enableReinitialize={true}
        initialValues={initialValue}
        validationSchema={validation}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={(values, { resetForm }) => {
          let submitValue = { ...values };
          submitValue.creation_datetime =
            values.creation_datetime === ''
              ? null
              : dayjs(values.creation_datetime).format();
          submitValue.account_no = returnNull(values.account_no);
          submitValue.pickup_location = values.pickup_location.map((item) => ({
            ...item,
            start_time:
              item.start_time === '' ? '' : dayjs(item.start_time).format(),
            end_time:
              item.end_time === '' ? null : dayjs(item.end_time).format(),
          }));
          submitValue.dropoff_location = values.dropoff_location.map(
            (item) => ({
              ...item,
              start_time:
                item.start_time === '' ? '' : dayjs(item.start_time).format(),

              end_time:
                item.end_time === '' ? null : dayjs(item.end_time).format(),
            })
          );
          submitValue.freight_details = [
            ...values.freight_details.map((item) => ({
              ...item,
              length: returnNull(item.length),
              width: returnNull(item.width),
              height: returnNull(item.height),
              weight: returnNull(item.weight),
              declared_value: returnNull(item.declared_value),
              quantity: returnNull(item.quantity),
            })),
          ];
          submitValue.status = 'accepted';

          submitValue.charges = {
            hauling_fee: {
              ...values.charges.hauling_fee,
              type: values.charges.hauling_fee.type,
              rate: returnNull(values.charges.hauling_fee.rate),
              amount: returnNull(
                loadRef.current.values.charges.hauling_fee.amount
              ),
            },
            fuel_surcharge: {
              ...values.charges.fuel_surcharge,
              type: loadRef.current.values.charges.fuel_surcharge.type,
              rate: returnNull(
                loadRef.current.values.charges.fuel_surcharge.rate
              ),
              amount: returnNull(
                loadRef.current.values.charges.fuel_surcharge.amount
              ),
            },
            accessorial_fee: [
              ...values.charges.accessorial_fee.map((item) => ({
                ...item,
                rate: returnNull(item.rate),
                amount: returnNull(item.amount),
                type: item.type,
              })),
            ],
            accessorial_deductions: [
              ...values.charges.accessorial_deductions.map((item) => ({
                ...item,
                rate: returnNull(item.rate),
                amount: returnNull(item.amount),
                type: item.type,
              })),
            ],
            discount: {
              ...values.charges.discount,
              type: values.charges.discount.type,
              rate: returnNull(values.charges.discount.rate),
              amount: returnNull(
                loadRef.current.values.charges.discount.amount
              ),
            },
          };

          console.log(submitValue);
          if (total_amount) {
            preview
              ? AxiosApi.patch(`/load/load/${preview.id}/`, submitValue).then(
                  (res) => {
                    dispatch(LoadAction.setEditLoad(res));
                    alertRef.current.showModel();
                    resetForm();
                  }
                )
              : AxiosApi.post('/load/load/', submitValue).then((res) => {
                  dispatch(LoadAction.setAddNewLoad(res));
                  alertRef.current.showModel();
                  resetForm();
                });
          }
        }}
      >
        {(formik) => (
          <div>
            
            <Form>
              <div id={Style.title}>
                <i
                  className="bx bx-left-arrow-alt bx-sm"
                  onClick={handleback}
                ></i>
                <h2>{preview ? 'Edit' : 'Create'} Load</h2>
                <p style={{ display: new_load_no ? 'none' : 'block' }}>
                  Note: Select Carrier Name First!!
                </p>
              </div>
              <main id={Style.outerWrap}>
                <section className={` ${Style.card} ${Style.header}`}>
                  <div className={Style.headerWrap}>
                    <h3>
                      Load No-
                      {new_load_no}
                    </h3>
                  </div>
                </section>
                {/* Broker/Others-------------------------------------------------------------------------------------------------------------------- */}
                <section className={` ${Style.card} ${Style.choose}`}>
                  <div className={Style.choiceWrap}>
                    <h4>Broker/Others</h4>
                    <div id={Style.choiceSlider}>
                      <p>Choose between Broker/Others</p>
                      <div id={Style.slider}>
                        <Button
                          type="button"
                          className={choice === 'Broker' ? Style.active : ''}
                          onClick={() => {
                            handler('Broker');
                            setChoice('Broker');
                            formik.setFieldValue('others', '');
                          }}
                        >
                          Broker
                        </Button>
                        <Button
                          type="button"
                          className={choice === 'Others' ? Style.active : ''}
                          onClick={() => {
                            handler('Others');
                            setChoice('Others');
                            formik.setFieldValue('broker', '');
                          }}
                        >
                          Others
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className={Style.line}></div>
                  <div className={Style.fieldWrapFull}>
                    <div className={Style.carrierWrap}>
                      <FormTextfield
                        control="select"
                        placeholder="Type Carrier Name"
                        label="Carrier*"
                        name={`carrier`}
                        options={carrier}
                        type="number"
                        onChange={(e) => {
                          formik.handleChange('carrier')(e.target.value);
                          handleCarrierChange(e.target.value);
                        }}
                      />
                      {/* <div
                        className={Style.carrierMessage}
                        style={{ display: new_load_no ? 'none' : 'block' }}
                      >
                        Select Carrier First*
                      </div> */}
                    </div>

                    {/* {console.log('new_load', new_load_no)} */}

                    <FormTextfield
                      control="input"
                      label="Load Creation Date/Time*"
                      name={`creation_datetime`}
                      type="datetime-local"
                      disabled={new_load_no ? false : true}
                    />

                    {choice === 'Broker' ? (
                      <FormTextfield
                        control="select"
                        placeholder={`Type ${choice} Name`}
                        label={choice + '*'}
                        options={broker}
                        wrap={true}
                        name={`broker`}
                        type="number"
                        clickHandler={formHandler}
                        disabled={new_load_no ? false : true}
                      />
                    ) : (
                      <FormTextfield
                        control="select"
                        options={others}
                        placeholder={`Type ${choice} Name`}
                        label={choice + '*'}
                        name={`others`}
                        wrap={true}
                        type="number"
                        clickHandler={formHandler}
                        disabled={new_load_no ? false : true}
                      />
                    )}

                    {/* <FormTextfield
                      control="input"
                      placeholder="Select Time"
                      label="Load Creation Time"
                      name={`load_creation_time`}
                      type="time"
                    /> */}
                    <FormTextfield
                      control="input"
                      placeholder="Enter Account Number"
                      label="Account No"
                      name={`account_no`}
                      type="number"
                      min={0}
                      disabled={new_load_no ? false : true}
                    />

                    <FormTextfield
                      control="input"
                      placeholder="Enter Reference"
                      label="Reference"
                      name={`reference`}
                      type="text"
                      disabled={new_load_no ? false : true}
                    />
                  </div>
                </section>
                {/* Freight Details-------------------------------------------------------------------------------------------------------------- */}
                <section className={` ${Style.card} ${Style.freight}`}>
                  <h4 className={Style.hr}>Freight Details</h4>

                  <FieldArray name="freight_details">
                    {(fieldArrayProps) => {
                      const { push, remove, form } = fieldArrayProps;
                      const { values } = form;
                      const { freight_details } = values;
                      // console.log('freight', freight_details);
                      return (
                        <>
                          {freight_details.map(
                            (freight_details_item, index) => (
                              <div className={Style.freightWrap} key={index}>
                                <label id={Style.freightLabel}>{`Freight ${
                                  index + 1
                                }`}</label>
                                <div className={Style.freightWrapGrid1}>
                                  <FormTextfield
                                    control="input"
                                    name={`freight_details[${index}].description`}
                                    label="Description"
                                    type="text"
                                    placeholder="Enter description"
                                    // fieldStyle={Style.customFieldStyle}
                                    disabled={new_load_no ? false : true}
                                  />
                                  <div className={Style.mutipleField}>
                                    <label>Quantity</label>
                                    <div className={Style.twoFieldWrap}>
                                      <Field
                                        name={`freight_details[${index}].quantity`}
                                        id={`freight_details[${index}].quantity`}
                                        placeholder="Enter"
                                        type="number"
                                        min={0}
                                        disabled={new_load_no ? false : true}
                                      />
                                      <Field
                                        as="select"
                                        name={`freight_details[${index}].quantity_type_name`}
                                        id={`freight_details[${index}].quantity_type_name`}
                                        disabled={new_load_no ? false : true}
                                      >
                                        {quantity_options.map((item, index) => (
                                          <option
                                            value={item.value}
                                            key={index}
                                          >
                                            {item.key}
                                          </option>
                                        ))}
                                      </Field>
                                    </div>
                                  </div>
                                  <FormTextfield
                                    control="input"
                                    name={`freight_details[${index}].declared_value`}
                                    id={`freight_details[${index}].declared_value`}
                                    label="Declared Value"
                                    type="number"
                                    min={0}
                                    placeholder="Type Here"
                                    disabled={new_load_no ? false : true}
                                    // fieldStyle={Style.customFieldStyle}
                                  />

                                  <div className={Style.mutipleField}>
                                    <label>Weight</label>
                                    <div className={Style.twoFieldWrap}>
                                      <Field
                                        name={`freight_details[${index}].weight`}
                                        id={`freight_details[${index}].weight`}
                                        placeholder="Enter"
                                        type="number"
                                        min={0}
                                        disabled={new_load_no ? false : true}
                                      />
                                      <Field
                                        as="select"
                                        name={`freight_details[${index}].weight_unit_name`}
                                        id={`freight_details[${index}].weight_unit_name`}
                                        disabled={new_load_no ? false : true}
                                      >
                                        {weight_unit.map((item, index) => (
                                          <option
                                            value={item.value}
                                            key={index}
                                          >
                                            {item.key}
                                          </option>
                                        ))}
                                      </Field>
                                    </div>
                                  </div>
                                  <div className={` ${Style.dimension}`}>
                                    <label>Dimensions</label>
                                    <div className={Style.dimensionWraper}>
                                      <Field
                                        name={`freight_details[${index}].length`}
                                        id={`freight_details[${index}].length`}
                                        placeholder="L"
                                        type="number"
                                        min={0}
                                        disabled={new_load_no ? false : true}
                                      />
                                      <Field
                                        name={`freight_details[${index}].width`}
                                        id={`freight_details[${index}].width`}
                                        placeholder="W"
                                        type="number"
                                        min={0}
                                        disabled={new_load_no ? false : true}
                                      />
                                      <Field
                                        name={`freight_details[${index}].height`}
                                        id={`freight_details[${index}].height`}
                                        placeholder="H"
                                        type="number"
                                        min={0}
                                        disabled={new_load_no ? false : true}
                                      />
                                      <Field
                                        as="select"
                                        name={`freight_details[${index}].dimensions_unit`}
                                        id={`freight_details[${index}].dimensions_unit`}
                                        disabled={new_load_no ? false : true}
                                      >
                                        {dimension.map((item, index) => (
                                          <option
                                            value={item.value}
                                            key={index}
                                          >
                                            {item.key}
                                          </option>
                                        ))}
                                      </Field>
                                    </div>
                                  </div>
                                  <FormTextfield
                                    control="textarea"
                                    name={`freight_details[${index}].comment`}
                                    type="text"
                                    placeholder="Comment"
                                    label="Comment"
                                    disabled={new_load_no ? false : true}
                                    // customWrap={Style.commentWrap}
                                    // fieldStyle={Style.commentField}
                                  />
                                </div>
                                {index > 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    id={Style.Button}
                                  >
                                    <i className="bx bx-x bx-sm"></i> Remove
                                  </button>
                                ) : null}
                              </div>
                            )
                          )}
                          <button
                            type="button"
                            onClick={() => push(freight)}
                            id={Style.Button}
                          >
                            <i className="bx bx-plus bx-sm"></i> Add Freight
                          </button>
                        </>
                      );
                    }}
                  </FieldArray>
                </section>
                <section className={` ${Style.card} ${Style.shipper}`}>
                  <h4 className={Style.hr}>Add Shipper</h4>
                  <FormTextfield
                    control="input"
                    placeholder="Type Shipper Name"
                    label="Shipper *"
                    name={`shipper.name`}
                    type="text"
                    disabled={new_load_no ? false : true}
                  />
                  <FieldArray name={`pickup_location`}>
                    {(fieldArrayProps) => {
                      const { push, remove, form } = fieldArrayProps;
                      const { values } = form;
                      const { pickup_location } = values;

                      return (
                        <>
                          {pickup_location.map((pickup_location_item, index) =>
                            pickUpIndex === index ? (
                              <div className={Style.popupForm} key={index}>
                                <div
                                  className={` ${Style.pickUpLocation_wrap}`}
                                >
                                  <label htmlFor="pickup_location">{`PickUp Location ${
                                    index + 1
                                  } *`}</label>
                                  <div
                                    className={Style.pickUpLocation_fieldWrap}
                                  >
                                    <div
                                      className={`pickup_location_container ${Style.yupValidation}`}
                                    >
                                      <Field
                                        name={`pickup_location[${index}].address.line_1`}
                                        placeholder="Address Line1"
                                        type="text"
                                        onMouseDown={() => {
                                          setIndexVal(index);
                                        }}
                                        value={
                                          formik.values.pickup_location[index]
                                            .address.line_1
                                        }
                                        className={`pickup_location_line_1 ${
                                          formik.errors?.pickup_location
                                            ? formik?.errors?.pickup_location[
                                                index
                                              ]?.address?.line_1 && 'errorStyle'
                                            : ''
                                        }`}
                                        disabled={new_load_no ? false : true}
                                      />
                                      <ErrorMessage
                                        name={`pickup_location[${index}].address.line_1`}
                                        component={Texterror}
                                      />
                                    </div>

                                    <Field
                                      name={`pickup_location[${index}].address.line_2`}
                                      id={`pickup_location[${index}].address.line_2`}
                                      placeholder="Address Line2"
                                      type="text"
                                      disabled={new_load_no ? false : true}
                                    />
                                    <Field
                                      name={`pickup_location[${index}].address.zipcode`}
                                      id={`pickup_location[${index}].address.zipcode`}
                                      placeholder="Zipcode"
                                      type="text"
                                      
                                      disabled={new_load_no ? false : true}
                                    />
                                    <Field
                                      name={`pickup_location[${index}].address.city`}
                                      id={`pickup_location[${index}].address.city`}
                                      placeholder="City"
                                      type="text"
                                      readOnly
                                      disabled={new_load_no ? false : true}
                                    />
                                    <Field
                                      name={`pickup_location[${index}].address.state`}
                                      id={`pickup_location[${index}].address.state`}
                                      placeholder="State"
                                      type="text"
                                      readOnly
                                      disabled={new_load_no ? false : true}
                                    />
                                  </div>
                                </div>
                                <div className={Style.dateTime}>
                                  <label>PickUp Date/Time *</label>
                                  <div
                                    className={`${Style.dateTimeField} ${
                                      formik.errors?.pickup_location
                                        ? formik?.errors?.pickup_location[index]
                                            ?.start_time && Style.errorStyle
                                        : ''
                                    }`}
                                  >
                                    {/* <div className={Style.dateTimeWrap}>
                                      <label>Date:</label>
                                      <Field
                                        name={`pickup_location[${index}].date`}
                                        id={`pickup_location[${index}].date`}
                                        type="date"
                                      />
                                    </div> */}
                                    <div className={Style.dateTimeWrap}>
                                      <label>Start Time:</label>

                                      <Field
                                        name={`pickup_location[${index}].start_time`}
                                        id={`pickup_location[${index}].start_time`}
                                        type="datetime-local"
                                        disabled={new_load_no ? false : true}
                                      />
                                    </div>
                                    <div className={Style.dateTimeWrap}>
                                      <label>End Time:</label>
                                      <Field
                                        name={`pickup_location[${index}].end_time`}
                                        id={`pickup_location[${index}].end_time`}
                                        type="datetime-local"
                                        disabled={new_load_no ? false : true}
                                      />
                                    </div>
                                    <ErrorMessage
                                      name={`pickup_location[${index}].start_time`}
                                      component={Texterror}
                                    />
                                  </div>
                                </div>

                                <FormTextfield
                                  control="input"
                                  placeholder="Contact Person Name"
                                  label="Contact Person At pickup*"
                                  name={`pickup_location[${index}].contact_name`}
                                  id={`pickup_location[${index}].contact_name`}
                                  type="text"
                                  disabled={new_load_no ? false : true}
                                />
                                <FormTextfield
                                  control="phone"
                                  placeholder="Enter Phone Number"
                                  label="Phone Number*"
                                  name={`pickup_location[${index}].contact_phone`}
                                  id={`pickup_location[${index}].contact_phone`}
                                  type="text"
                                  phoneWrap={Style.phoneStyle}
                                  onChange={(e) =>
                                    formik.setFieldValue(
                                      `pickup_location[${index}].contact_phone`,
                                      `+${e}`
                                    )
                                  }
                                  disabled={new_load_no ? false : true}
                                />
                                <FormTextfield
                                  control="input"
                                  placeholder="Enter BOL Number"
                                  label="BOL#"
                                  name={`pickup_location[${index}].bol`}
                                  id={`pickup_location[${index}].bol`}
                                  type="text"
                                  disabled={new_load_no ? false : true}
                                />
                                <FormTextfield
                                  control="input"
                                  placeholder="Enter Reference"
                                  label="Reference"
                                  name={`pickup_location[${index}].reference`}
                                  id={`pickup_location[${index}].reference`}
                                  type="text"
                                  disabled={new_load_no ? false : true}
                                />
                                <FormTextfield
                                  control="textarea"
                                  name={`pickup_location[${index}].instruction`}
                                  id={`pickup_location[${index}].instruction`}
                                  type="text"
                                  placeholder="PickUp Instruction"
                                  label="PickUp Instruction"
                                  disabled={new_load_no ? false : true}
                                  // customWrap={Style.commentWrap}
                                  // fieldStyle={Style.commentField}
                                />
                                <div className={Style.saveDeleteWrap}>
                                  {index > 0 ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setPickUpIndex('');
                                        remove(index);
                                        setWayPointsPickUp((prev) =>
                                          prev.filter(
                                            (item) => item.index !== index
                                          )
                                        );
                                      }}
                                      className={Style.closeButtonForm}
                                    >
                                      <i className="bx bxs-trash bx-sm"></i>
                                      Delete
                                    </button>
                                  ) : null}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPickUpIndex('');
                                    }}
                                    id={Style.SaveButton}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div
                                key={index}
                                className={`${Style.popupCard} ${
                                  formik.errors?.pickup_location
                                    ? formik?.errors?.pickup_location[index] &&
                                      Style.errorStyle
                                    : ''
                                } `}
                              >
                                <p className={Style.dateAndTime}>
                                  <span>{`PickUp ${
                                    index + 1
                                  } : Date/Time`}</span>
                                  {`Start- ${pickup_location_item?.start_time} / End- ${pickup_location_item?.end_time}`}
                                </p>

                                <p>
                                  <span>{'Address-'}</span>
                                  {`${pickup_location_item?.address?.line_1}`}
                                </p>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setPickUpIndex(index);
                                    loadBingApi(
                                      process.env.REACT_APP_API_KEY
                                    ).then(() => {
                                      initMap('pick');
                                    });
                                  }}
                                  className={Style.editButton}
                                >
                                  <i className="bx bxs-edit bx-sm"></i>
                                </button>
                                {index > 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      remove(index);
                                      setPickUpIndex((prev) => prev - 1);
                                      setWayPointsPickUp((prev) =>
                                        prev.filter(
                                          (item) => item.index !== index
                                        )
                                      );
                                    }}
                                    className={Style.closeButton}
                                  >
                                    <i className="bx bxs-trash bx-sm"></i>
                                  </button>
                                ) : null}
                              </div>
                            )
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              push(pickUp);
                              setPickUpIndex(pickup_location.length);
                              loadBingApi(process.env.REACT_APP_API_KEY).then(
                                () => {
                                  initMap('pick');
                                }
                              );
                            }}
                            id={Style.Button}
                          >
                            <i className="bx bx-plus bx-sm"></i> Add Another
                            Pick-up Location
                          </button>
                        </>
                      );
                    }}
                  </FieldArray>
                </section>
                <section className={` ${Style.card} ${Style.consignee}`}>
                  <h4 className={Style.hr}>Add Consignee</h4>
                  <FormTextfield
                    control="input"
                    placeholder="Type Consignee Name"
                    label="Consignee *"
                    name={`consignee.name`}
                    type="text"
                    disabled={new_load_no ? false : true}
                  />
                  <FieldArray name="dropoff_location">
                    {(fieldArrayProps) => {
                      const { push, remove, form } = fieldArrayProps;
                      const { values } = form;
                      const { dropoff_location } = values;
                      return (
                        <>
                          {dropoff_location.map(
                            (dropoff_location_item, index) =>
                              dropOffIndex === index ? (
                                <div className={Style.popupForm} key={index}>
                                  <div
                                    className={`${Style.pickUpLocation_wrap}`}
                                  >
                                    <label htmlFor="dropoff_location">{`Drop Off Location ${
                                      index + 1
                                    } *`}</label>
                                    <div
                                      className={Style.pickUpLocation_fieldWrap}
                                    >
                                      <div
                                        className={`drop_location_container  ${Style.yupValidation}`}
                                      >
                                        <Field
                                          name={`dropoff_location[${index}].address.line_1`}
                                          className={`dropoff_location_line_1 ${
                                            formik.errors?.dropoff_location
                                              ? formik?.errors
                                                  ?.dropoff_location[index]
                                                  ?.address?.line_1 &&
                                                'errorStyle'
                                              : ''
                                          }`}
                                          placeholder="Address Line1"
                                          type="text"
                                          onMouseDown={() => {
                                            setIndexValDrop(index);
                                          }}
                                          disabled={new_load_no ? false : true}
                                        />
                                        <ErrorMessage
                                          name={`dropoff_location[${index}].address.line_1`}
                                          component={Texterror}
                                        />
                                      </div>

                                      <Field
                                        name={`dropoff_location[${index}].address.line_2`}
                                        id={`dropoff_location[${index}].address.line_2`}
                                        placeholder="Address Line2"
                                        type="text"
                                        disabled={new_load_no ? false : true}
                                      />
                                      <Field
                                        name={`dropoff_location[${index}].address.zipcode`}
                                        id={`dropoff_location[${index}].address.zipcode`}
                                        placeholder="Zipcode"
                                        type="text"
                                        
                                      />
                                      <Field
                                        name={`dropoff_location[${index}].address.city`}
                                        id={`dropoff_location[${index}].address.city`}
                                        placeholder="City"
                                        type="text"
                                        readOnly
                                      />
                                      <Field
                                        name={`dropoff_location[${index}].address.state`}
                                        id={`dropoff_location[${index}].address.state`}
                                        placeholder="State"
                                        type="text"
                                        readOnly
                                      />
                                    </div>
                                  </div>
                                  <div className={Style.dateTime}>
                                    <label>Delivery Date/Time *</label>
                                    <div
                                      className={`${Style.dateTimeField} ${
                                        formik.errors?.dropoff_location
                                          ? formik?.errors?.dropoff_location[
                                              index
                                            ]?.start_time && Style.errorStyle
                                          : ''
                                      }`}
                                    >
                                      {/* <div className={Style.dateTimeWrap}>
                                        <label>Date:</label>
                                        <Field
                                          name={`dropoff_location[${index}].date`}
                                          id={`dropoff_location[${index}].date`}
                                          type="date"
                                        />
                                      </div> */}
                                      <div className={Style.dateTimeWrap}>
                                        <label>Start Time:</label>
                                        <Field
                                          name={`dropoff_location[${index}].start_time`}
                                          id={`dropoff_location[${index}].start_time`}
                                          type="datetime-local"
                                          disabled={new_load_no ? false : true}
                                        />
                                      </div>
                                      <div className={Style.dateTimeWrap}>
                                        <label>End Time:</label>
                                        <Field
                                          name={`dropoff_location[${index}].end_time`}
                                          id={`dropoff_location[${index}].end_time`}
                                          type="datetime-local"
                                          disabled={new_load_no ? false : true}
                                        />
                                      </div>
                                      <ErrorMessage
                                        name={`dropoff_location[${index}].start_time`}
                                        component={Texterror}
                                      />
                                    </div>
                                  </div>

                                  <FormTextfield
                                    control="input"
                                    placeholder="Contact Person Name"
                                    label="Contact Person At delivery*"
                                    name={`dropoff_location[${index}].contact_name`}
                                    id={`dropoff_location[${index}].contact_name`}
                                    type="text"
                                    disabled={new_load_no ? false : true}
                                  />
                                  <FormTextfield
                                    control="phone"
                                    placeholder="Enter Phone Number"
                                    label="Phone Number*"
                                    name={`dropoff_location[${index}].contact_phone`}
                                    id={`dropoff_location[${index}].contact_phone`}
                                    type="text"
                                    phoneWrap={Style.phoneStyle}
                                    onChange={(e) =>
                                      formik.setFieldValue(
                                        `dropoff_location[${index}].contact_phone`,
                                        `+${e}`
                                      )
                                    }
                                    disabled={new_load_no ? false : true}
                                  />
                                  <FormTextfield
                                    control="input"
                                    placeholder="Enter BOL Number"
                                    label="BOL#"
                                    name={`dropoff_location[${index}].bol`}
                                    id={`dropoff_location[${index}].bol`}
                                    type="text"
                                    disabled={new_load_no ? false : true}
                                  />
                                  {/* <FormTextfield
                                    control="input"
                                    placeholder="Enter Reference"
                                    label="Reference"
                                    name={`dropoff_location[${index}].reference`}
                                    id={`dropoff_location[${index}].reference`}
                                    type="text"
                                  /> */}

                                  <FormTextfield
                                    control="textarea"
                                    name={`dropoff_location[${index}].instruction`}
                                    id={`dropoff_location[${index}].instruction`}
                                    type="text"
                                    placeholder="Delivery Instruction"
                                    label="Delivery Instruction"
                                    disabled={new_load_no ? false : true}
                                  />
                                  <div className={Style.saveDeleteWrap}>
                                    {index > 0 ? (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setDropOffIndex('');
                                          setWayPointsDrop((prev) =>
                                            prev.filter(
                                              (item) => item.index !== index
                                            )
                                          );
                                          remove(index);
                                        }}
                                        className={Style.closeButtonForm}
                                      >
                                        <i className="bx bxs-trash bx-sm"></i>
                                        Delete
                                      </button>
                                    ) : null}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setDropOffIndex('');
                                      }}
                                      id={Style.SaveButton}
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  key={index}
                                  className={`${Style.popupCard} ${
                                    formik.errors?.dropoff_location
                                      ? formik?.errors?.dropoff_location[
                                          index
                                        ] && Style.errorStyle
                                      : ''
                                  } `}
                                >
                                  <p className={Style.dateAndTime}>
                                    <span>{`DropOff ${
                                      index + 1
                                    } : Date/Time`}</span>
                                    {`Start- ${dropoff_location_item?.start_time} / End- ${dropoff_location_item?.end_time}`}
                                  </p>

                                  <p>
                                    <span>{'Address-'}</span>
                                    {`${dropoff_location_item?.address?.line_1}`}
                                  </p>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDropOffIndex(index);
                                      loadBingApi(
                                        process.env.REACT_APP_API_KEY
                                      ).then(() => {
                                        initMap('drop');
                                      });
                                    }}
                                    className={Style.editButton}
                                  >
                                    <i className="bx bxs-edit bx-sm"></i>
                                  </button>
                                  {index > 0 ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        remove(index);
                                        setDropOffIndex((prev) => prev - 1);
                                        setWayPointsDrop((prev) =>
                                          prev.filter(
                                            (item) => item.index !== index
                                          )
                                        );
                                      }}
                                      className={Style.closeButton}
                                    >
                                      <i className="bx bxs-trash bx-sm"></i>
                                    </button>
                                  ) : null}
                                </div>
                              )
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              push(pickUp);
                              setDropOffIndex(dropoff_location.length);
                              loadBingApi(process.env.REACT_APP_API_KEY).then(
                                () => {
                                  initMap('drop');
                                }
                              );
                            }}
                            id={Style.Button}
                          >
                            <i className="bx bx-plus bx-sm"></i> Add Another
                            Delivery Location
                          </button>
                        </>
                      );
                    }}
                  </FieldArray>
                </section>
                <section className={`${Style.card} ${Style.additional}`}>
                  <h4 className={Style.hr}>Additional Details</h4>
                  <div id={Style.dropTrailer}>
                    <Field
                      type="checkbox"
                      onClick={() => {
                        formik.setFieldValue(
                          'drop_trailer',
                          !formik.values.drop_trailer
                        );
                        formik.setFieldValue('trailer_type', '');
                      }}
                      checked={formik.values.drop_trailer === true}
                      name="drop_trailer"
                      id="drop_trailer"
                      disabled={new_load_no ? false : true}
                    />
                    <label htmlFor="drop_trailer">Drop trailer</label>
                  </div>
                  <div className={Style.additionalWrap}>
                    <FormTextfield
                      control="select"
                      name="trailer_type"
                      options={TrailerType}
                      label="Trailer Type"
                      disabled={formik.values.drop_trailer ? true : false}
                    />
                    <FormTextfield
                      control="select"
                      name="load_type"
                      options={loadType}
                      label="Load Type"
                      disabled={new_load_no ? false : true}
                    />
                  </div>
                </section>
                <section className={Style.charges}>
                  <main id={Style.outerWrapGrid}>
                    <div id={Style.chargesFieldWrap}>
                      <h3>Charges</h3>
                      <div id={Style.chargesInnerFieldWrap}>
                        <div id={Style.header}>
                          <p>DESCRIPTION</p>
                          <p>TYPE</p>
                          <p>RATE</p>
                          <p>AMOUNT</p>
                        </div>
                        <section className={Style.FieldWrap}>
                          <label htmlFor={'charges.hauling_fee'}>
                            {'Hauling Fee'}
                          </label>
                          <Field
                            as="select"
                            name="charges.hauling_fee.type"
                            id="charges.hauling_fee.type"
                            onChange={(e) => {
                              formik.handleChange('charges.hauling_fee.type')(
                                e.target.value
                              );
                              formik.setFieldValue(
                                'charges.hauling_fee.rate',
                                ''
                              );
                              formik.setFieldValue(
                                'charges.hauling_fee.amount',
                                0
                              );
                            }}
                            onBlur={formik.handleBlur}
                            disabled={new_load_no ? false : true}
                          >
                            <option value="">Select Fee Type</option>
                            <option value="flat_fee">Flat Fee</option>
                            <option value="per_mile">Per Mile</option>
                          </Field>
                          <Field
                            name="charges.hauling_fee.rate"
                            id="charges.hauling_fee.rate"
                            type="number"
                            min={0}
                            onKeyUp={(e) => {
                              // formik.setFieldValue(
                              //   'hauling_fee.rate',
                              //   +e.target.value
                              // );

                              formik.setFieldValue(
                                'charges.hauling_fee.amount',
                                formik?.values.charges.hauling_fee.type ===
                                  'per_mile'
                                  ? e.target.value * Miles
                                  : formik?.values.charges.hauling_fee.type ===
                                    'flat_fee'
                                  ? +e.target.value > 0
                                    ? +e.target.value
                                    : 0
                                  : ''
                              );
                            }}
                            onBlur={() => calculateTotal()}
                            disabled={new_load_no ? false : true}
                          />
                          <Field
                            name="charges.hauling_fee.amount"
                            id="charges.hauling_fee.amount"
                            type="number"
                            min={0}
                            readOnly
                            value={
                              formik?.values?.charges?.hauling_fee.type ===
                              'per_mile'
                                ? formik.values.charges.hauling_fee.rate * Miles
                                : formik.values.charges.hauling_fee.type ===
                                  'flat_fee'
                                ? +formik.values.charges.hauling_fee.rate > 0
                                  ? +formik.values.charges.hauling_fee.rate
                                  : 0
                                : ''
                            }
                            disabled={new_load_no ? false : true}
                          />
                        </section>

                        <section className={Style.FieldWrap}>
                          <label htmlFor={'charges.fuel_sucharge'}>
                            {'Fuel SurCharge'}
                          </label>
                          <Field
                            as="select"
                            name="charges.fuel_surcharge.type"
                            onChange={(e) => {
                              formik.handleChange(
                                'charges.fuel_surcharge.type'
                              )(e.target.value);
                              formik.setFieldValue(
                                'charges.fuel_surcharge.rate',
                                ''
                              );
                              formik.setFieldValue(
                                'charges.fuel_surcharge.amount',
                                0
                              );
                            }}
                            disabled={new_load_no ? false : true}
                          >
                            <option value="">Select Fee Type</option>
                            <option value="flat_fee">Flat Fee</option>
                            <option value="percentage">Percentage</option>
                          </Field>
                          <Field
                            name="charges.fuel_surcharge.rate"
                            type="number"
                            min={0}
                            onKeyUp={(e) => {
                              formik.setFieldValue(
                                'charges.fuel_surcharge.amount',
                                formik.values.charges.fuel_surcharge.type ===
                                  'percentage'
                                  ? `${percentage(
                                      e.target.value,
                                      Miles ? Miles : 0
                                    )}`
                                  : formik.values.charges.fuel_surcharge
                                      .type === 'flat_fee'
                                  ? +e.target.value > 0
                                    ? +e.target.value
                                    : 0
                                  : ''
                              );
                            }}
                            onBlur={() => calculateTotal()}
                            disabled={new_load_no ? false : true}
                          />
                          <Field
                            name="charges.fuel_surcharge.amount"
                            type="number"
                            min={0}
                            onBlur={formik.handleBlur}
                            readOnly
                            value={
                              formik.values.charges.fuel_surcharge.type ===
                              'percentage'
                                ? `${percentage(
                                    formik.values.charges.fuel_surcharge.rate,
                                    Miles
                                  )}`
                                : formik.values.charges.fuel_surcharge.type ===
                                  'flat_fee'
                                ? +formik.values.charges.fuel_surcharge.rate > 0
                                  ? +formik.values.charges.fuel_surcharge.rate
                                  : 0
                                : ''
                            }
                            disabled={new_load_no ? false : true}
                          />
                        </section>

                        <section>
                          <FieldArray name="charges.accessorial_fee">
                            {(fieldArrayProps) => {
                              const { push, remove, form } = fieldArrayProps;
                              const { values } = form;
                              const { accessorial_fee } = values.charges;

                              return (
                                <>
                                  {accessorial_fee.map(
                                    (accessorial_fee_item, index) => (
                                      <div
                                        key={index}
                                        className={Style.accessorialWrap}
                                      >
                                        <label
                                          htmlFor={'charges.accessorial_fee'}
                                        >
                                          {'Accessorial Fee'}
                                        </label>
                                        <Field
                                          as="select"
                                          name={`charges.accessorial_fee[${index}].type`}
                                          id={Style.optionStyle}
                                          onChange={(e) => {
                                            if (e.target.value === 'add_new') {
                                              setpopup_addnew(true);
                                              return;
                                            }
                                            formik.handleChange(
                                              `charges.accessorial_fee[${index}].type`
                                            )(e.target.value);
                                            formik.setFieldValue(
                                              `charges.accessorial_fee[${index}].rate`,
                                              ''
                                            );
                                            formik.setFieldValue(
                                              `charges.accessorial_fee[${index}].amount`,
                                              0
                                            );
                                          }}
                                          onBlur={formik.handleBlur}
                                          disabled={new_load_no ? false : true}
                                        >
                                          <option value="">
                                            Select fee Type
                                          </option>
                                          {charges_options
                                            ? charges_options.map(
                                                ({ id, name }, index) => (
                                                  <option
                                                    value={id}
                                                    key={index}
                                                  >
                                                    {name}
                                                  </option>
                                                )
                                              )
                                            : null}
                                          <option value="add_new">
                                            Add new
                                          </option>
                                        </Field>
                                        <Field
                                          name={`charges.accessorial_fee[${index}].rate`}
                                          type="number"
                                          min={0}
                                          onKeyUp={(e) => {
                                            // formik.handleChange(
                                            //   `accessorial_fee[${index}].rate`
                                            // )(e.target.value);
                                            formik.setFieldValue(
                                              `charges.accessorial_fee[${index}].amount`,
                                              +e.target.value
                                            );
                                          }}
                                          onBlur={() => calculateTotal()}
                                          disabled={new_load_no ? false : true}
                                        />
                                        <div id={Style.deleteButtonWrap}>
                                          <Field
                                            name={`charges.accessorial_fee[${index}].amount`}
                                            readOnly
                                            onBlur={formik.handleBlur}
                                            value={accessorial_fee_item.rate}
                                            disabled={
                                              new_load_no ? false : true
                                            }
                                          />
                                          <div id={Style.deleteButtonWrap}>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                remove();
                                                calculateTotal(
                                                  accessorial_fee_item.rate
                                                );
                                              }}
                                              id={Style.deleteButton}
                                            >
                                              <i className="bx bx-x-circle bx-sm"></i>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                  <div id={Style.addButtonWrap}>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        push({
                                          type: '',
                                          rate: '',
                                          amount: '',
                                        })
                                      }
                                      id={Style.addnewButton}
                                    >
                                      <i className="bx bx-plus bx-sm"></i> Add
                                      Accessorial Fee
                                    </button>
                                  </div>
                                </>
                              );
                            }}
                          </FieldArray>
                        </section>
                        <section>
                          <FieldArray name="charges.accessorial_deductions">
                            {(fieldArrayProps) => {
                              const { push, remove, form } = fieldArrayProps;
                              const { values } = form;
                              const { accessorial_deductions } = values.charges;
                              return (
                                <>
                                  {accessorial_deductions.map(
                                    (accessorial_deduction_item, index) => (
                                      <div
                                        key={index}
                                        className={Style.accessorialWrap}
                                      >
                                        <label
                                          htmlFor={
                                            'charges.accessorial_deductions'
                                          }
                                        >
                                          {'Accessorial Deduction'}
                                        </label>
                                        <Field
                                          as="select"
                                          name={`charges.accessorial_deductions[${index}].type`}
                                          id={Style.optionStyle}
                                          onChange={(e) => {
                                            if (e.target.value === 'add_new') {
                                              setpopup_addnew(true);
                                              return;
                                            }
                                            formik.handleChange(
                                              `charges.accessorial_deductions[${index}].type`
                                            )(e.target.value);
                                            formik.setFieldValue(
                                              `charges.accessorial_deductions[${index}].rate`,
                                              ''
                                            );
                                            formik.setFieldValue(
                                              `charges.accessorial_deductions[${index}].amount`,
                                              0
                                            );
                                          }}
                                          disabled={new_load_no ? false : true}
                                        >
                                          <option value="">
                                            Select fee Type
                                          </option>
                                          {charges_options
                                            ? charges_options.map(
                                                (item, index) => (
                                                  <option
                                                    value={item.id}
                                                    key={index}
                                                  >
                                                    {item.name}
                                                  </option>
                                                )
                                              )
                                            : null}
                                          <option value="add_new">
                                            Add new
                                          </option>
                                        </Field>
                                        <Field
                                          name={`charges.accessorial_deductions[${index}].rate`}
                                          type="number"
                                          min={0}
                                          onKeyUp={(e) => {
                                            formik.setFieldValue(
                                              `charges.accessorial_deductions[${index}].amount`,
                                              +e.target.value
                                            );
                                          }}
                                          onBlur={() => calculateTotal()}
                                          disabled={new_load_no ? false : true}
                                        />
                                        <div id={Style.deleteButtonWrap}>
                                          <Field
                                            name={`charges.accessorial_deductions[${index}].amount`}
                                            readOnly
                                            onBlur={formik.handleBlur}
                                            value={
                                              accessorial_deduction_item.rate
                                            }
                                            disabled={
                                              new_load_no ? false : true
                                            }
                                          />

                                          <div id={Style.deleteButtonWrap}>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                remove(index);
                                                calculateTotal(
                                                  -accessorial_deduction_item.rate
                                                );
                                              }}
                                              id={Style.deleteButton}
                                            >
                                              <i className="bx bx-x-circle bx-sm"></i>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                  <div id={Style.addButtonWrap}>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        push({
                                          type: '',
                                          rate: '',
                                          amount: '',
                                        })
                                      }
                                      id={Style.addnewButton}
                                    >
                                      <i className="bx bx-plus bx-sm"></i> Add
                                      Accessorial Deduction
                                    </button>
                                  </div>
                                </>
                              );
                            }}
                          </FieldArray>
                        </section>
                        <section className={Style.FieldWrap}>
                          <label htmlFor={'charges.discount'}>
                            {'Discount'}
                          </label>
                          <Field
                            as="select"
                            name="charges.discount.type"
                            onChange={(e) => {
                              formik.handleChange('charges.discount.type')(
                                e.target.value
                              );
                              formik.setFieldValue('charges.discount.rate', '');
                              formik.setFieldValue(
                                'charges.discount.amount',
                                0
                              );
                            }}
                            disabled={new_load_no ? false : true}
                          >
                            <option value="">Select Fee Type</option>
                            <option value="flat_fee">Flat Fee</option>
                            <option value="percentage">Percentage</option>
                          </Field>
                          <Field
                            name="charges.discount.rate"
                            min={0}
                            type="number"
                            // onKeyUp={(e) => {
                            //   formik.setFieldValue(
                            //     'charges.discount.amount',
                            //     formik.values.charges.discount.type ===
                            //       'percentage'
                            //       ? +parseFloat(
                            //           percentage(
                            //             +e.target.value,
                            //             +formik.values.charges.total_amount
                            //           )
                            //         ).toFixed(2)
                            //       : formik.values.charges.discount.type ===
                            //         'flat_fee'
                            //       ? +e.target.value > 0
                            //         ? +e.target.value
                            //         : 0
                            //       : ''
                            //   );
                            // }}
                            onBlur={() => calculateTotal()}
                            disabled={new_load_no ? false : true}
                          />
                        
                          <Field
                            name="charges.discount.amount"
                            type="number"
                            readOnly
                            value={
                              formik.values.charges.discount.type ===
                              'percentage'
                                ? percentage(
                                    formik.values.charges.discount.rate,
                                    totalAmount
                                  )
                                : formik.values.charges.discount.type ===
                                  'flat_fee'
                                ? +formik.values.charges.discount.rate
                                : ''
                            }
                            disabled={new_load_no ? false : true}
                          />
                        </section>
                        <section className={Style.TotalWrap}>
                          <div></div>
                          <div></div>
                          <label htmlFor="charges.total_amount">Total</label>
                          <div className={Style.total_amount_field}>
                            <Field
                              name="charges.total_amount"
                              readOnly
                              value={
                                '$' +
                                parseFloat(
                                  parseFloat(
                                    formik.values.charges?.fuel_surcharge
                                      .amount === ''
                                      ? 0
                                      : formik.values.charges?.fuel_surcharge
                                          .amount
                                  ) +
                                    parseFloat(
                                      formik.values.charges?.hauling_fee
                                        .amount === '' ||
                                        formik.values.charges?.hauling_fee
                                          .amount === undefined
                                        ? 0
                                        : formik.values.charges?.hauling_fee
                                            .amount
                                    ) +
                                    parseFloat(
                                      simpleArraySum(
                                        formik.values.charges?.accessorial_fee.map(
                                          (item) => item.amount
                                        )
                                      ) === ''
                                        ? 0
                                        : simpleArraySum(
                                            formik.values.charges?.accessorial_fee.map(
                                              (item) => item.amount
                                            )
                                          )
                                    ) -
                                    parseFloat(
                                      simpleArraySum(
                                        formik.values.charges?.accessorial_deductions.map(
                                          (item) => item.amount
                                        )
                                      ) === ''
                                        ? 0
                                        : simpleArraySum(
                                            formik.values.charges?.accessorial_deductions.map(
                                              (item) => item.amount
                                            )
                                          )
                                    ).toFixed(2) -
                                    parseFloat(
                                      formik.values.charges.discount.amount ===
                                        ''
                                        ? 0
                                        : formik.values.charges?.discount.amount
                                    ).toFixed(2)
                                ).toFixed(2)
                              }
                            />
                            <div
                              className={Style.total_amount_error}
                              style={{ display: total_amount ? 'none' : '' }}
                            >
                              Amount cannot be Negative
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                    <div id={Style.mileSection}>
                      <h3>Miles</h3>
                      <div id={Style.mileWrap}>
                        <div>
                          <label htmlFor={'total_mile'}>{'Total miles'}</label>
                          <div className={Style.milesFieldWrap}>
                            <Field
                              name="total_mile"
                              id="total_mile"
                              type="number"
                              value={
                                formik.values.miles_type === 'bing_maps'
                                  ? Miles
                                  : formik.values.total_mile
                              }
                              readOnly={
                                formik.values.miles_type === 'bing_maps'
                                  ? true
                                  : false
                              }
                              // onChange={(e) => {
                              //   formik.handleChange('miles')(+e.target.value);
                              // }}
                              onKeyUp={(e) => {
                                formik.setFieldValue(
                                  'total_mile',
                                  e.target.value
                                );
                                setMiles(
                                  parseFloat(
                                    e.target.value ? e.target.value : 0
                                  )
                                );
                              }}
                              onBlur={(e) => {
                                calculateTotal();
                              }}
                              disabled={new_load_no ? false : true}
                            />
                            <ErrorMessage
                              name="total_mile"
                              component={Texterror}
                            />
                          </div>
                        </div>
                        <div className={Style.milesType}>
                          <label htmlFor={'miles_type'}>{'Bing Maps'}</label>
                          <input
                            name="miles_type"
                            type="radio"
                            value={'bing_maps'}
                            onMouseDown={(e) => {
                              initDirection();
                              formik.setFieldValue('total_mile', 0);
                              setMiles(0);
                              formik.handleChange('miles_type')(e.target.value);
                            }}
                            onClick={(e) => {
                              calculateTotal();
                            }}
                            defaultChecked={
                              formik.values.miles_type === 'bing_maps'
                                ? true
                                : false
                            }
                            disabled={new_load_no ? false : true}
                          />
                        </div>
                        <div className={Style.milesType}>
                          <label htmlFor={'miles_type'}>{'Manual'}</label>
                          <input
                            name="miles_type"
                            type="radio"
                            value={'manual'}
                            defaultChecked={
                              formik.values.miles_type === 'manual'
                                ? true
                                : false
                            }
                            onMouseDown={(e) => {
                              formik.setFieldValue('total_mile', 0);
                              setBingMiles(0);
                              setMiles(0);

                              formik.handleChange('miles_type')(e.target.value);
                            }}
                            onClick={() => {
                              calculateTotal();
                            }}
                            disabled={new_load_no ? false : true}
                          />
                        </div>
                      </div>
                    </div>
                  </main>
                </section>
              </main>
            </Form>
            {/* Charges------------------------------------------------------------------------------------------------------------------------------ */}

            <div id="printoutPanel" />
            <div id={Style.buttonSection}>
              <div id={Style.buttonWraper}>
                <button onClick={handleback} type="submit">
                  Cancel
                </button>
                <AlertModel
                  type={`Save As Draft`}
                  title={`Successfully added.`}
                  button1="Close"
                  button2="Okay!"
                  typeoff="submit"
                  ref={alertRef}
                  handleClick={() => handleDraft(formik.values)}
                  handleOkay={() => console.log('Saved')}
                  navigateTo={'/loadtable'}
                />
                <AlertModel
                  type={`Create Load`}
                  title={`Successfully added.`}
                  button1="Close"
                  button2="Okay!"
                  typeoff="submit"
                  ref={alertRef}
                  handleClick={formik.submitForm}
                  handleOkay={() => console.log('Saved')}
                  navigateTo={'/loadtable'}
                />
              </div>
            </div>
          </div>
        )}
      </Formik>

      <div ref={mapRef} className="map" />
    </>
  );
});

export default LoadForm;
