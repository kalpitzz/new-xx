import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import Style from '../../CreateLoad/loadForm/createLoad.module.css';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import Texterror from '../../../components/Formfield/TextError/Texterror';
import FormTextField from '../../../components/Formfield/formikControl';
import { Modal, Box } from '@mui/material';
import useAxios from '../../../hooks/useAxios';
import * as Yup from 'yup';

const Charges = forwardRef(({ bingMiles, initDirection, previewData }, ref) => {
  let newLoadInfo = useSelector((state) => state.loadReducer.loadNum);
  const [Miles, setMiles] = useState(0);
  const [popup_addnew, setpopup_addnew] = useState(false);
  const [options, setOptions] = useState(
    newLoadInfo.accessorial || newLoadInfo
  );
  const AxiosApi = useAxios();

  function percentage(partialValue, totalValue) {
    return (+partialValue * +totalValue) / 100;
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

  useEffect(() => {
    if (bingMiles) {
      setMiles(+bingMiles);
      ref.current?.setFieldValue('miles', +bingMiles);
    }
  }, [bingMiles, ref]);

  function SetHauling_fee() {
    ref.current.setFieldValue(
      'hauling_fee.amount',
      ref.current?.values.hauling_fee.type === 'per_mile'
        ? ref.current?.values.hauling_fee.rate * Miles
        : ref.current?.values.hauling_fee.type === 'flat_fee'
        ? +ref.current?.values.hauling_fee.rate > 0
          ? +ref.current?.values.hauling_fee.rate
          : 0
        : ''
    );
  }
  useEffect(() => {
    if (previewData) {
      setMiles(previewData.total_mile);
    }
  }, [previewData]);

  useEffect(() => {
    SetHauling_fee();
  }, [ref.current?.values.hauling_fee.rate, Miles]);

  useEffect(() => {
    ref.current.setFieldValue(
      'fuel_surCharge.amount',
      ref.current?.values.fuel_surCharge.type === 'percentage'
        ? percentage(ref.current?.values.fuel_surCharge.rate, Miles)
        : ref.current?.values.fuel_surCharge.type === 'flat_fee'
        ? +ref.current?.values.fuel_surCharge.rate > 0
          ? +ref.current?.values.fuel_surCharge.rate
          : 0
        : ''
    );
  }, [ref.current?.values.fuel_surCharge.rate, Miles]);
  useEffect(() => {
    ref.current.setFieldValue(
      'discount.amount',
      ref.current?.values.discount.type === 'percentage'
        ? percentage(ref.current?.values.discount.rate, Miles)
        : ref.current?.values.discount.type === 'flat_fee'
        ? +ref.current?.values.discount.rate > 0
          ? +ref.current?.values.discount.rate
          : 0
        : ''
    );
  }, [ref.current?.values.discount.rate, Miles]);

  // useImperativeHandle(ref, () => ({
  //   submitForm() {},
  // }));

  let initialValue = {
    hauling_fee: {
      rate: '',
      type: '',
      amount: '',
    },
    fuel_surCharge: {
      rate: '',
      type: '',
      amount: '',
    },
    accessorial_fee: [{ type: '', rate: '', amount: '' }],
    accessorial_deduction: [{ type: '', rate: '', amount: '' }],
    discount: {
      rate: '',
      type: '',
      amount: '',
    },
    miles: '',
    miles_type: 'manual',
    totalAmount: '',
  };
  let previewValue;
  if (previewData) {
    previewValue = {
      hauling_fee: {
        rate: 10,
        type: 'per_mile',
        amount: 20,
      },
      fuel_surCharge: {
        rate: '',
        type: '',
        amount: 0,
      },
      accessorial_fee: [{ type: '', rate: '', amount: 0 }],
      accessorial_deduction: [{ type: '', rate: '', amount: 0 }],
      discount: {
        rate: '',
        type: '',
        amount: 0,
      },
      miles: previewData.total_mile,
      miles_type: 'manual',
      totalAmount: '',
    };
  }

  const validation = Yup.object().shape({
    miles: Yup.string().required('Required'),
  });

  const validation_accessorial = Yup.object().shape({
    name: Yup.string().required('Required'),
  });
  function returnNull(value) {
    return value === '' ? null : value;
  }

  return (
    <>
      <Formik
        initialValues={{ name: '', description: '' }}
        validationSchema={validation_accessorial}
        onSubmit={(values, { resetForm }) => {
          let addnew = { ...values };
          addnew.description = returnNull(values.description);
          AxiosApi.post('/load/accessorial_fee/', addnew).then((res) => {
            setOptions([...options, res]);
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
                  <FormTextField name="name" label="Name*" control="input" />
                  <FormTextField
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
        innerRef={ref}
        enableReinitialize={true}
        initialValues={previewData ? previewValue : initialValue}
        validationSchema={validation}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={(values) => {
          values.totalAmount = parseFloat(
            parseFloat(
              values.fuel_surCharge.amount === ''
                ? 0
                : values.fuel_surCharge.amount
            ) +
              parseFloat(
                values.hauling_fee.amount === '' ? 0 : values.hauling_fee.amount
              ) +
              parseFloat(
                simpleArraySum(
                  values.accessorial_fee.map((item) => item.amount)
                ) === ''
                  ? 0
                  : simpleArraySum(
                      values.accessorial_fee.map((item) => item.amount)
                    )
              ) -
              parseFloat(
                simpleArraySum(
                  values.accessorial_deduction.map((item) => item.amount)
                ) === ''
                  ? 0
                  : simpleArraySum(
                      values.accessorial_deduction.map((item) => item.amount)
                    )
              )
          ).toFixed(2);
          // chargesDataFetcher(values);console
          // console.log(values);
        }}
      >
        {(formik) => (
          <Form>
            <main id={Style.outerWrap}>
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
                    <label htmlFor={'hauling_fee'}>{'Hauling Fee'}</label>
                    <Field
                      as="select"
                      name="hauling_fee.type"
                      id="hauling_fee.type"
                      onChange={(e) => {
                        formik.handleChange('hauling_fee.type')(e.target.value);
                        formik.setFieldValue('hauling_fee.rate', '');
                        formik.setFieldValue('hauling_fee.amount', 0);
                      }}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">Select Fee Type</option>
                      <option value="flat_fee">Flat Fee</option>
                      <option value="per_mile">Per Mile</option>
                    </Field>
                    <Field
                      name="hauling_fee.rate"
                      id="hauling_fee.rate"
                      type="number"
                      onKeyUp={(e) => {
                        // formik.setFieldValue(
                        //   'hauling_fee.rate',
                        //   +e.target.value
                        // );
                        formik.setFieldValue(
                          'hauling_fee.amount',
                          formik?.values.hauling_fee.type === 'per_mile'
                            ? e.target.value * Miles
                            : formik?.values.hauling_fee.type === 'flat_fee'
                            ? +e.target.value > 0
                              ? +e.target.value
                              : 0
                            : ''
                        );
                      }}
                    />
                    <Field
                      name="hauling_fee.amount"
                      id="hauling_fee.amount"
                      type="number"
                      readOnly
                      value={
                        formik.values.hauling_fee.type === 'per_mile'
                          ? formik.values.hauling_fee.rate * Miles
                          : formik.values.hauling_fee.type === 'flat_fee'
                          ? +formik.values.hauling_fee.rate > 0
                            ? +formik.values.hauling_fee.rate
                            : 0
                          : ''
                      }
                    />
                  </section>

                  <section className={Style.FieldWrap}>
                    <label htmlFor={'fuel_surCharge'}>{'Fuel SurCharge'}</label>
                    <Field
                      as="select"
                      name="fuel_surCharge.type"
                      onChange={(e) => {
                        formik.handleChange('fuel_surCharge.type')(
                          e.target.value
                        );
                        formik.setFieldValue('fuel_surCharge.rate', '');
                        formik.setFieldValue('fuel_surCharge.amount', 0);
                      }}
                    >
                      <option value="">Select Fee Type</option>
                      <option value="flat_fee">Flat Fee</option>
                      <option value="percentage">Percentage</option>
                    </Field>
                    <Field
                      name="fuel_surCharge.rate"
                      type="number"
                      onKeyUp={(e) => {
                        formik.setFieldValue(
                          'fuel_surCharge.amount',
                          formik.values.fuel_surCharge.type === 'percentage'
                            ? `${percentage(e.target.value, Miles)}`
                            : formik.values.fuel_surCharge.type === 'flat_fee'
                            ? +e.target.value > 0
                              ? +e.target.value
                              : 0
                            : ''
                        );
                      }}
                      onBlur={formik.handleBlur}
                    />
                    <Field
                      name="fuel_surCharge.amount"
                      type="number"
                      onBlur={formik.handleBlur}
                      readOnly
                      value={
                        formik.values.fuel_surCharge.type === 'percentage'
                          ? `${percentage(
                              formik.values.fuel_surCharge.rate,
                              Miles
                            )}`
                          : formik.values.fuel_surCharge.type === 'flat_fee'
                          ? +formik.values.fuel_surCharge.rate > 0
                            ? +formik.values.fuel_surCharge.rate
                            : 0
                          : ''
                      }
                    />
                  </section>

                  <section>
                    <FieldArray name="accessorial_fee">
                      {(fieldArrayProps) => {
                        const { push, remove, form } = fieldArrayProps;
                        const { values } = form;
                        const { accessorial_fee } = values;

                        return (
                          <>
                            {accessorial_fee.map(
                              (accessorial_fee_item, index) => (
                                <div
                                  key={index}
                                  className={Style.accessorialWrap}
                                >
                                  <label htmlFor={'accessorial_fee'}>
                                    {'Accessorial Fee'}
                                  </label>
                                  <Field
                                    as="select"
                                    name={`accessorial_fee[${index}].type`}
                                    onChange={(e) => {
                                      if (e.target.value === 'add_new') {
                                        setpopup_addnew(true);
                                        return;
                                      }
                                      formik.handleChange(
                                        `accessorial_fee[${index}].type`
                                      )(e.target.value);
                                      formik.setFieldValue(
                                        `accessorial_fee[${index}].rate`,
                                        ''
                                      );
                                      formik.setFieldValue(
                                        `accessorial_fee[${index}].amount`,
                                        0
                                      );
                                    }}
                                    onBlur={formik.handleBlur}
                                  >
                                    <option value="">Select fee Type</option>
                                    {options.map((item, index) => (
                                      <option value={item.id} key={index}>
                                        {item.name}
                                      </option>
                                    ))}
                                    <option value="add_new">Add new</option>
                                  </Field>
                                  <Field
                                    name={`accessorial_fee[${index}].rate`}
                                    type="number"
                                    onKeyUp={(e) => {
                                      // formik.handleChange(
                                      //   `accessorial_fee[${index}].rate`
                                      // )(e.target.value);
                                      formik.setFieldValue(
                                        `accessorial_fee[${index}].amount`,
                                        +e.target.value
                                      );
                                    }}
                                  />
                                  <div id={Style.deleteButtonWrap}>
                                    <Field
                                      name={`accessorial_fee[${index}].amount`}
                                      readOnly
                                      onBlur={formik.handleBlur}
                                      value={accessorial_fee_item.rate}
                                    />
                                    <div id={Style.deleteButtonWrap}>
                                      <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        id={Style.deleteButton}
                                      >
                                        <i className="bx bx-minus bx-sm"></i>
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
                                  push({ type: '', rate: '', amount: '' })
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
                    <FieldArray name="accessorial_deduction">
                      {(fieldArrayProps) => {
                        const { push, remove, form } = fieldArrayProps;
                        const { values } = form;
                        const { accessorial_deduction } = values;
                        return (
                          <>
                            {accessorial_deduction.map(
                              (accessorial_deduction_item, index) => (
                                <div
                                  key={index}
                                  className={Style.accessorialWrap}
                                >
                                  <label htmlFor={'accessorial_deduction'}>
                                    {'Accessorial Deduction'}
                                  </label>
                                  <Field
                                    as="select"
                                    name={`accessorial_deduction[${index}].type`}
                                    onChange={(e) => {
                                      if (e.target.value === 'add_new') {
                                        setpopup_addnew(true);
                                        return;
                                      }
                                      formik.handleChange(
                                        `accessorial_deduction[${index}].type`
                                      )(e.target.value);
                                      formik.setFieldValue(
                                        `accessorial_deduction[${index}].rate`,
                                        ''
                                      );
                                      formik.setFieldValue(
                                        `accessorial_deduction[${index}].amount`,
                                        0
                                      );
                                    }}
                                    onBlur={formik.handleBlur}
                                  >
                                    <option value="">Select fee Type</option>
                                    {options.map((item, index) => (
                                      <option value={item.id} key={index}>
                                        {item.name}
                                      </option>
                                    ))}
                                    <option value="add_new">Add new</option>
                                  </Field>
                                  <Field
                                    name={`accessorial_deduction[${index}].rate`}
                                    type="number"
                                    onKeyUp={(e) => {
                                      // formik.handleChange(
                                      //   `accessorial_deduction[${index}].rate`
                                      // )(e.target.value);
                                      formik.setFieldValue(
                                        `accessorial_deduction[${index}].amount`,
                                        +e.target.value
                                      );
                                    }}
                                  />
                                  <div id={Style.deleteButtonWrap}>
                                    <Field
                                      name={`accessorial_deduction[${index}].amount`}
                                      readOnly
                                      onBlur={formik.handleBlur}
                                      value={accessorial_deduction_item.rate}
                                    />

                                    <div id={Style.deleteButtonWrap}>
                                      <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        id={Style.deleteButton}
                                      >
                                        <i className="bx bx-minus bx-sm"></i>
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
                                  push({ type: '', rate: '', amount: '' })
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
                    <label htmlFor={'discount'}>{'Discount'}</label>
                    <Field
                      as="select"
                      name="discount.type"
                      onChange={(e) => {
                        formik.handleChange('discount.type')(e.target.value);
                        formik.setFieldValue('discount.rate', '');
                        formik.setFieldValue('discount.amount', 0);
                      }}
                    >
                      <option value="">Select Fee Type</option>
                      <option value="flat_fee">Flat Fee</option>
                      <option value="percentage">Percentage</option>
                    </Field>
                    <Field
                      name="discount.rate"
                      onBlur={formik.handleBlur}
                      type="number"
                      onKeyUp={(e) => {
                        formik.setFieldValue(
                          'discount.amount',
                          formik.values.discount.type === 'percentage'
                            ? `${percentage(e.target.value, Miles)}`
                            : formik.values.discount.type === 'flat_fee'
                            ? +e.target.value > 0
                              ? +e.target.value
                              : 0
                            : ''
                        );
                      }}
                    />
                    {/* {console.log('formik', formik)} */}
                    <Field
                      name="discount.amount"
                      onChange={(e) => {
                        formik.handleChange('discount.amount')(e.target.value);
                      }}
                      onBlur={formik.handleBlur}
                      readOnly
                      value={
                        formik.values.discount.type === 'percentage'
                          ? `${percentage(formik.values.discount.rate, Miles)}`
                          : formik.values.discount.type === 'flat_fee'
                          ? +formik.values.discount.rate > 0
                            ? +formik.values.discount.rate
                            : 0
                          : ''
                      }
                    />
                  </section>
                  <section className={Style.TotalWrap}>
                    <div></div>
                    <div></div>
                    <label htmlFor="totalAmount">Total</label>

                    <Field
                      name="totalAmount"
                      readOnly
                      value={
                        '$' +
                        parseFloat(
                          parseFloat(
                            formik.values.fuel_surCharge.amount === ''
                              ? 0
                              : formik.values.fuel_surCharge.amount
                          ) +
                            parseFloat(
                              formik.values.hauling_fee.amount === ''
                                ? 0
                                : formik.values.hauling_fee.amount
                            ) +
                            parseFloat(
                              simpleArraySum(
                                formik.values.accessorial_fee.map(
                                  (item) => item.amount
                                )
                              ) === ''
                                ? 0
                                : simpleArraySum(
                                    formik.values.accessorial_fee.map(
                                      (item) => item.amount
                                    )
                                  )
                            ) -
                            parseFloat(
                              simpleArraySum(
                                formik.values.accessorial_deduction.map(
                                  (item) => item.amount
                                )
                              ) === ''
                                ? 0
                                : simpleArraySum(
                                    formik.values.accessorial_deduction.map(
                                      (item) => item.amount
                                    )
                                  )
                            ) -
                            parseFloat(
                              formik.values.discount.amount === ''
                                ? 0
                                : formik.values.discount.amount
                            )
                        ).toFixed(2)
                      }
                    />
                  </section>
                </div>
              </div>
              <div id={Style.mileSection}>
                <h3>Miles</h3>
                <div id={Style.mileWrap}>
                  <div>
                    <label htmlFor={'miles'}>{'Total miles'}</label>
                    <div className={Style.milesFieldWrap}>
                      <Field
                        name="miles"
                        id="miles"
                        type="number"
                        value={
                          formik.values.miles_type === 'bing'
                            ? Miles
                            : formik.values.miles
                        }
                        readOnly={
                          formik.values.miles_type === 'bing' ? true : false
                        }
                        // onChange={(e) => {
                        //   formik.handleChange('miles')(+e.target.value);
                        // }}
                        onBlur={(e) => {
                          // formik.handleChange('miles')(e.target.value);
                          setMiles(parseFloat(e.target.value));
                        }}
                      />
                      <ErrorMessage name="miles" component={Texterror} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor={'miles_type'}>{'Bing Maps'}</label>
                    <input
                      name="miles_type"
                      type="radio"
                      value={'bing'}
                      onClick={(e) => {
                        initDirection();
                        formik.setFieldValue('miles', 0);
                        setMiles(0);
                        formik.handleChange('miles_type')(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor={'miles_type'}>{'Manual'}</label>
                    <input
                      name="miles_type"
                      type="radio"
                      value={'manual'}
                      defaultChecked
                      onClick={(e) => {
                        formik.setFieldValue('miles', 0);
                        bingMiles = '';
                        setMiles(0);
                        formik.handleChange('miles_type')(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <button type="submit">Click</button>
            </main>
          </Form>
        )}
      </Formik>
    </>
  );
});

export default Charges;
