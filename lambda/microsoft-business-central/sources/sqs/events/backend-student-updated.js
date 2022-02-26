const sns = require("../../../services/sns");
const microsoft = require("../../../services/microsoft-business-central");

module.exports = async function (event) {
  const { body } = event;

  let student = await microsoft.getStudent(body.Id);
  if (!student) {
    throw new Error(`Student ${body.Id} not found`);
  }

  student = await microsoft.updateStudent(student, {
    studentFirstName: body["firstName"],
    studentLastName: body["lastName"],
    studentEmail: body["emailAddress"],
    studentGender: body["gender"],
    superiorName: body["superiorName"],
    superiorEmail: body["superiorEmail"],
    language: body["locale"],
    employeeId: body["personnelNumber"],
    organizationId: body["organizationId"],
    accountId: body["organization"]["accountId"],
    costCenter: body["organization"]["costCenter"],
  });

  await sns.publish("MicrosoftBusinessCentralStudentUpdated", student);
};
