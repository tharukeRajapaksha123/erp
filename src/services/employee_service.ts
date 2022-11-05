
import http, { post, put } from "../http-common"
import { EmployeeModel } from "../models/employee_model"
import companyId from "../config"
const url = "https://lozzby.herokuapp.com";


const getEmployees = async (offset: number, pagination: number): Promise<EmployeeModel[]> => {
   return await http.get(`employee-controller/${companyId.companyId}/${pagination}/${offset}`).then((result) => {
      return result.data.employees;
   }).catch(err => {
      console.log(`get employees failed ${err}`);
      return [];
   }
   )

}

const updateEmployee = async (id: string, employee: EmployeeModel) => {
   console.log("==> id is " + id)
   await put(url + `/employee-controller/update-employee/${id}`,
      {
         name: employee.name,
         nic: employee.nic,
         age: employee.age,
         salary: employee.salary,
         role: employee.role,
         address: employee.address,
         contactNumber: employee.contactNumber,
      }
   ).then(result => result.data);
}

const createEmployee = async (employee: EmployeeModel) => {


   post(url + "/employee-controller/create-employee",
      {
         name: employee.name,
         nic: employee.nic,
         age: employee.age,
         salary: employee.salary,
         role: employee.role,
         address: employee.address,
         contactNumber: employee.contactNumber,

      },
   ).then(result => {
      console.log(result.data);
      return result.data;
   }).catch(err => console.log(err));
   // console.log("order created")

}

const deleteEmployee = async (id: string) => {
   console.log("called")
   await http.delete(`employee-controller/delete-employee/${id}`).then(result => result.data);
}

const EmployeeService = { getEmployees, updateEmployee, createEmployee, deleteEmployee }

export default EmployeeService