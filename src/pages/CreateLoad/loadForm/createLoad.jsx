import React, { useState, useEffect } from 'react';
import Style from './createLoad.module.css';
import { Formik, Form, Field, FieldArray } from 'formik';

const CreateLoadForm = () => {
  const [Miles, setMiles] = useState(0);
  const [stateValues, setStateValue] = useState({
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
    totalAmount: '',
    miles: '',
    accessorial_fee: [{ type: '', rate: '', amount: '' }],
    accessorial_deduction: [{ type: '', rate: '', amount: '' }],
  });

  function percentage(partialValue, totalValue) {
    return (partialValue * totalValue) / 100;
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
    if (Miles > 0) {
      stateValues.hauling_fee.amount =
        stateValues.hauling_fee.type === 'per_mile'
          ? stateValues.hauling_fee.rate * Miles
          : stateValues.hauling_fee.type === 'flat_fee'
          ? stateValues.hauling_fee.rate > 0
            ? stateValues.hauling_fee.rate
            : 0
          : '';
      stateValues.fuel_surCharge.amount =
        stateValues.fuel_surCharge.type === 'percentage'
          ? parseFloat(
              percentage(stateValues.fuel_surCharge.rate, Miles)
            ).toFixed(2)
          : stateValues.fuel_surCharge.type === 'flat_fee'
          ? parseFloat(stateValues.fuel_surCharge.rate).toFixed(2) > 0
            ? parseFloat(stateValues.fuel_surCharge.rate).toFixed(2)
            : 0
          : '';
      stateValues.totalAmount = parseFloat(
        parseFloat(
          stateValues.fuel_surCharge.amount === ''
            ? 0
            : stateValues.fuel_surCharge.amount
        ) +
          parseFloat(
            stateValues.hauling_fee.amount === ''
              ? 0
              : stateValues.hauling_fee.amount
          ) +
          parseFloat(
            simpleArraySum(
              stateValues.accessorial_fee.map((item) => item.amount)
            ) === ''
              ? 0
              : simpleArraySum(
                  stateValues.accessorial_fee.map((item) => item.amount)
                )
          )
      ).toFixed(2);
    }
  }, [Miles]);
  return (
    <>
      <Formik
        initialValues={{
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
          totalAmount: '',
          miles: '',
          accessorial_fee: [{ type: '', rate: '', amount: '' }],
          accessorial_deduction: [{ type: '', rate: '', amount: '' }],
        }}
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
          console.log(values);
        }}
      >
        {(formik) => (
          <Form>
            <main id={Style.outerWrap}>
              <div id={Style.chargesFieldWrap}>
                <h3>Charges</h3>
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
                    onKeyUp={(e) => {
                      formik.handleChange('hauling_fee.rate')(e.target.value);
                      formik.setFieldValue(
                        'hauling_fee.amount',
                        formik.values.hauling_fee.type === 'per_mile'
                          ? formik.values.hauling_fee.rate * Miles
                          : formik.values.hauling_fee.type === 'flat_fee'
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
                    onKeyUp={(e) => {
                      formik.handleChange('fuel_surCharge.rate')(
                        e.target.value
                      );
                      formik.setFieldValue(
                        'fuel_surCharge.amount',
                        formik.values.fuel_surCharge.type === 'percentage'
                          ? percentage(formik.values.fuel_surCharge.rate, Miles)
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
                    onChange={(e) => {
                      formik.handleChange('fuel_surCharge.amount')(
                        e.target.value
                      );
                    }}
                    onBlur={formik.handleBlur}
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
                                  <option value="">Select Fee Type</option>
                                  <option value="flat_fee">Flat Fee</option>
                                  <option value="percentage">Percentage</option>
                                </Field>
                                <Field
                                  name={`accessorial_fee[${index}].rate`}
                                  onKeyUp={(e) => {
                                    formik.handleChange(
                                      `accessorial_fee[${index}].rate`
                                    )(e.target.value);
                                    formik.setFieldValue(
                                      `accessorial_fee[${index}].amount`,
                                      accessorial_fee_item.type === 'percentage'
                                        ? percentage(
                                            accessorial_fee_item.rate,
                                            Miles
                                          )
                                        : accessorial_fee_item.type ===
                                          'flat_fee'
                                        ? +e.target.value > 0
                                          ? +e.target.value
                                          : 0
                                        : ''
                                    );
                                  }}
                                />
                                <div id={Style.deleteButtonWrap}>
                                  <Field
                                    name={`accessorial_fee[${index}].amount`}
                                    onChange={(e) => {
                                      formik.handleChange(
                                        `accessorial_fee[${index}].amount`
                                      )(e.target.value);
                                    }}
                                    readOnly
                                    onBlur={formik.handleBlur}
                                    value={
                                      accessorial_fee_item.type === 'percentage'
                                        ? `${percentage(
                                            accessorial_fee_item.rate,
                                            Miles
                                          )}`
                                        : accessorial_fee_item.type ===
                                          'flat_fee'
                                        ? +accessorial_fee_item.rate > 0
                                          ? +accessorial_fee_item.rate
                                          : 0
                                        : ''
                                    }
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
                              onClick={() => push('')}
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
                                  <option value="">Select Fee Type</option>
                                  <option value="flat_fee">Flat Fee</option>
                                  <option value="percentage">Percentage</option>
                                </Field>
                                <Field
                                  name={`accessorial_deduction[${index}].rate`}
                                  onKeyUp={(e) => {
                                    formik.handleChange(
                                      `accessorial_deduction[${index}].rate`
                                    )(e.target.value);
                                    formik.setFieldValue(
                                      `accessorial_deduction[${index}].amount`,
                                      accessorial_deduction_item.type ===
                                        'percentage'
                                        ? percentage(
                                            accessorial_deduction_item.rate,
                                            Miles
                                          )
                                        : accessorial_deduction_item.type ===
                                          'flat_fee'
                                        ? +e.target.value > 0
                                          ? +e.target.value
                                          : 0
                                        : ''
                                    );
                                  }}
                                />
                                <div id={Style.deleteButtonWrap}>
                                  <Field
                                    name={`accessorial_deduction[${index}].amount`}
                                    onChange={(e) => {
                                      formik.handleChange(
                                        `accessorial_deduction[${index}].amount`
                                      )(e.target.value);
                                    }}
                                    readOnly
                                    onBlur={formik.handleBlur}
                                    value={
                                      accessorial_deduction_item.type ===
                                      'percentage'
                                        ? `${percentage(
                                            accessorial_deduction_item.rate,
                                            Miles
                                          )}`
                                        : accessorial_deduction_item.type ===
                                          'flat_fee'
                                        ? +accessorial_deduction_item.rate > 0
                                          ? +accessorial_deduction_item.rate
                                          : 0
                                        : ''
                                    }
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
                              onClick={() => push('')}
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
                          )
                      ).toFixed(2)
                    }
                  />
                </section>
              </div>
              <div id={Style.mileSection}>
                <h3>Miles</h3>
                <div id={Style.mileWrap}>
                  <label htmlFor={'miles'}>{'Total miles'}</label>
                  <Field
                    name="miles"
                    id="miles"
                    onBlur={(e) => {
                      formik.handleChange('miles')(e.target.value);
                      setMiles(parseFloat(e.target.value));
                      setStateValue({ ...formik.values });
                    }}
                  />
                </div>
              </div>
            </main>
            <button type="submit" id={Style.submitButton}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateLoadForm;
