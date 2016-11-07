"use strict";
const assert = require('assert');
const keys = require('lodash/keys');
const difference = require('lodash/difference');
const clone = require('lodash/clone');
const defaults = require('lodash/defaults');
const first = require('lodash/first');

class ModelValidatorTest {
    constructor({
        validator,
        completeValidRecords,
        requiredFields,
        invalidFields,
        invalidFieldsets = [] // Hold fields that when put together generate a validation erro
    } = {}) {
        this.validator = validator;
        this.validRecords = completeValidRecords;
        this.completeValidRecord = first(completeValidRecords);
        this.requiredFields = requiredFields;
        this.nonRequiredFields = difference(keys(this.completeValidRecord), requiredFields);
        this.invalidFields = invalidFields;
        this.invalidFieldsets = invalidFieldsets;
    }

    runTests()  {
        let validator, completeValidRecord;
        beforeEach(() => {
            validator = this.validator;
            completeValidRecord = clone(this.completeValidRecord);
        });

        describe("validate()", () => {
            this.validRecords.forEach((validRecord) => {
                describe(`with a complete, valid record: ${JSON.stringify(validRecord)}`, () => {
                    describe("and 'enforceRequiredFields' parameter = true", () => {
                        it("should return a response indicated the record is valid", () => {
                            const response = validator.validate(validRecord, true);
                            assert.ok(response.isValid);
                        });
                    });

                    describe("and 'enforceRequiredFields' parameter = false", () => {
                        it("should return a response indicated the record is valid", () => {
                            const response = validator.validate(validRecord, false);
                            assert.ok(response.isValid);
                        });
                    });
                });
            });

            describe("with all fields valid", () => {
                this.nonRequiredFields.forEach((field) => {
                    describe(`and non-required field '${field}' omitted`, () => {
                        let partialRecord;
                        beforeEach(() => {
                            partialRecord = clone(completeValidRecord);
                            delete partialRecord[field];
                        });

                        describe("and 'enforceRequiredFields' parameter = true", () => {
                            it("should return a response indicated the record is valid", () => {
                                const response = validator.validate(partialRecord, true);
                                assert.ok(response.isValid);
                            });
                        });

                        describe("and 'enforceRequiredFields' parameter = false", () => {
                            it("should return a response indicated the record is valid", () => {
                                const response = validator.validate(partialRecord, false);
                                assert.ok(response.isValid);
                            });
                        });
                    });
                });
            });

            describe("with all fields valid", () => {
                this.requiredFields.forEach((field) => {
                    describe(`and required field '${field}' omitted`, () => {
                        let partialRecord;
                        beforeEach(() => {
                            partialRecord = clone(completeValidRecord);
                            delete partialRecord[field];
                        });

                        describe("and 'enforceRequiredFields' parameter = true", () => {
                            it("should return a failed response indicating missing fields are required", () => {
                                const response = validator.validate(partialRecord, true);
                                assert.ok(!response.isValid);
                                assert.ok(response.fieldErrors[field], "We should have an error for the missing field");
                            });
                        });

                        describe("and 'enforceRequiredFields' parameter = false", () => {
                            it("should return a response indicated the record is valid", () => {
                                const response = validator.validate(partialRecord, false);
                                assert.ok(response.isValid);
                            });
                        });
                    });
                });
            });

            keys(this.invalidFields).forEach((invalidField) => {
                describe(`with invalid value for field ${invalidField}`, () => {
                    this.invalidFields[invalidField].forEach((invalidValue) => {
                        describe(`of ${JSON.stringify(invalidValue)}`, () => {
                            let invalidRecord;
                            beforeEach(() => {
                                invalidRecord = clone(completeValidRecord);
                                invalidRecord[invalidField] = invalidValue;
                            });

                            describe("and 'enforceRequiredFields' parameter = true", () => {
                                it("should return a response indicated the invalid fields need to be fixed", () => {
                                    const response = validator.validate(invalidRecord, true);
                                    assert.ok(!response.isValid);
                                    assert.ok(response.fieldErrors[invalidField], "We should have an error for the missing field");
                                });
                            });

                            describe("and 'enforceRequiredFields' parameter = false", () => {
                                it("should return a response indicated the invalid fields need to be fixed", () => {
                                    const response = validator.validate(invalidRecord, false);
                                    assert.ok(!response.isValid);
                                    assert.ok(response.fieldErrors[invalidField], "We should have an error for the missing field");
                                });
                            });
                        });
                    });
                });
            });

            this.invalidFieldsets.forEach((fieldset) => {
                describe(`with invalid field set: ${JSON.stringify(fieldset)}`, () => {
                    [true, false].forEach((enforceRequiredFields) => {
                        describe(`and 'enforceRequiredFields' = ${JSON.stringify(enforceRequiredFields)}`, () => {
                            it("should return a response indicating a validation error", () => {
                                const record = defaults(fieldset, completeValidRecord);
                                const response = validator.validate(record, enforceRequiredFields);
                                assert.ok(!response.isValid);
                            });
                        });
                    });
                });
            });
        });
    }
}

module.exports = ModelValidatorTest;