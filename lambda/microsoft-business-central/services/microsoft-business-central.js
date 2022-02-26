const fetch = require("node-fetch");

const TOKEN = process.env.TOKEN;
const USER_DOMAIN_NAME = process.env.USER_DOMAIN_NAME;
const ENVIRONMENT = process.env.ENVIRONMENT;
const COMPANY_ID = process.env.COMPANY_ID;

const API_URL = `https://api.businesscentral.dynamics.com/v2.0/${USER_DOMAIN_NAME}/${ENVIRONMENT}/api/learnship/aws/v1.0/companies(${COMPANY_ID})`;
const BATCH_API_URL = `https://api.businesscentral.dynamics.com/v2.0/${USER_DOMAIN_NAME}/${ENVIRONMENT}/api/learnship/aws/v1.0/$batch`;

async function getContact(id) {
  return getResource("lscontacts", id);
}

async function createContact(contact) {
  return createResource("lscontacts", contact);
}

async function updateContact(contact, data) {
  return createResource("lscontacts", {
    ...contact,
    ...data,
  });
}

async function deleteContact(id) {
  return deleteResource("lscontacts", id);
}

async function getContract(id) {
  return getResource("lscontracts", id, { expand: "lineItems" });
}

async function createContract(contract) {
  return createResource("lscontracts", contract);
}

async function updateContract(contract, data) {
  return createResource("lscontracts", {
    ...contract,
    ...data,
  });
}

async function deleteContract(id) {
  return deleteResource("lscontracts", id);
}

async function createContractLine(line) {
  return createResource("lineItems", line);
}

async function updateContractLine(line, data) {
  return createResource("lineItems", {
    ...line,
    ...data,
  });
}

async function deleteContractLine(id) {
  return deleteResource("lineItems", id);
}

async function getProduct(id) {
  return getResource("lsproducts", id);
}

async function createProducts(products) {
  return batchCreateResources("lsproducts", products);
}

async function createProduct(product) {
  return createResource("lsproducts", product);
}

async function updateProduct(product, data) {
  return createResource("lsproducts", {
    ...product,
    ...data,
  });
}

async function deleteProduct(id) {
  return deleteResource("lsproducts", id);
}

async function getCourse(id) {
  return getResource("lscourses", id);
}

async function createCourse(course) {
  return createResource("lscourses", course);
}

async function updateCourse(course, data) {
  return createResource("lscourses", {
    ...course,
    ...data,
  });
}

async function deleteCourse(id) {
  return deleteResource("lscourses", id);
}

async function getLicense(id) {
  return getResource("lslicense", id);
}

async function createLicense(license) {
  return createResource("lslicense", license);
}

async function updateLicense(license, data) {
  return createResource("lslicense", {
    ...license,
    ...data,
  });
}

async function deleteLicense(id) {
  return deleteResource("lslicense", id);
}

async function getPoolEntry(id) {
  return getResource("lspoolentry", id);
}

async function createPoolEntry(poolEntry) {
  return createResource("lspoolentry", poolEntry);
}

async function updatePoolEntry(poolEntry, data) {
  return createResource("lspoolentry", {
    ...poolEntry,
    ...data,
  });
}

async function deletePoolEntry(id) {
  return deleteResource("lspoolentry", id);
}

async function getStudent(id) {
  return getResource("lsstudent", id);
}

async function createStudent(student) {
  return createResource("lsstudent", student);
}

async function updateStudent(student, data) {
  return createResource("lsstudent", {
    ...student,
    ...data,
  });
}

async function deleteStudent(id) {
  return deleteResource("lsstudent", id);
}

async function getResource(resourceName, resourceId, options = {}) {
  let query = "";

  if (options.expand) {
    query += `&$expand=${options.expand}`;
  }

  const response = await fetch(
    `${API_URL}/${resourceName}('${resourceId}')?${query}`,
    {
      headers: {
        Authorization: `Basic ${TOKEN}`,
      },
    }
  );

  if (response.status === 404) {
    return null;
  }

  return response.json();
}

async function createResource(resourceName, resource) {
  const response = await fetch(`${API_URL}/${resourceName}`, {
    method: "POST",
    body: JSON.stringify(resource),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${TOKEN}`,
    },
  });

  return response.json();
}

async function updateResource(resourceName, resourceId, data) {
  const response = await fetch(`${API_URL}/${resourceName}('${resourceId}')`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${TOKEN}`,
      "If-Match": "*",
    },
  });

  return response.json();
}

async function deleteResource(resourceName, resourceId) {
  await fetch(`${API_URL}/${resourceName}('${resourceId}')`, {
    method: "DELETE",
    headers: {
      Authorization: `Basic ${TOKEN}`,
    },
  });

  return null;
}

async function batchCreateResources(resourceName, resources) {
  const requests = resources.map((resource, i) => {
    return {
      method: "POST",
      id: `r${i}`,
      url: `companies(${COMPANY_ID})/${resourceName}`,
      headers: {
        "Content-Type": "application/json"
      },
      body: resource
    }
  })

  const response = await fetch(`${BATCH_API_URL}`, {
    method: "POST",
    body: JSON.stringify({ requests }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${TOKEN}`,
    },
  });

  return response.text();
}

module.exports = {
  getContact,
  createContact,
  updateContact,
  deleteContact,
  getContract,
  createContract,
  updateContract,
  deleteContract,
  createContractLine,
  updateContractLine,
  deleteContractLine,
  getProduct,
  createProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getLicense,
  createLicense,
  updateLicense,
  deleteLicense,
  getPoolEntry,
  createPoolEntry,
  updatePoolEntry,
  deletePoolEntry,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
