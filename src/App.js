import React, { useEffect, useState } from "react";
import "./App.css";
import MaterialTable from "material-table";
import CustomDatePicker from "./customDatePicker";
import axios from "axios";
import { alpha } from '@material-ui/core/styles';

function App() {
  const URL = "http://localhost:8000/glacier-user/";
  const [data, setData] = useState([]);

  let fetchData = () => {
    try {
      fetch(URL).then((response) => {
       response.json().then(data => {
         console.log(data);
         setData(data.data)
       });
      }) 
      
     } catch (e) {
       console.error(e);
     }
  }

  let postData = async (dataR) => {
    let postData = await axios.post(URL, dataR);
    console.log(postData);
    setData([...data, postData.data.data])
  }

  let patchData = async (dataR) => {
    let dataP = await axios.patch(`${URL}${dataR._id}`, dataR);
    console.log(dataP);
    fetchData()
  }

  let deleteData = async (dataR) => {
    let dataP = await axios.delete(`${URL}${dataR._id}`, dataR);
    console.log(dataP);
    fetchData()
  }

  useEffect(()=>{
       const ac = new AbortController();
      fetchData();
      return ac.abort();
  },[])

  
  const columns = [
    { title: "ID", field: "_id", editable: false },
    {
      title: "Name",
      field: "name",
      validate: (rowData) => {
        if (rowData.name === undefined || rowData.name === "") {
          return "Required";
        } else if (rowData.name.length < 3) {
          return "Name should contains atleast 3 chars";
        }
        return true;
      },
    },
    {
      title: "Email",
      field: "email",
      validate: (rowData) => {
        if (rowData.email === undefined || rowData.email === "") {
          return "Required";
        } else if (!rowData.email.includes("@" && ".")) {
          return "Enter valid email address";
        }
        return true;
      },
    },
    {
      title: "Phone Number",
      field: "phone",
      validate: (rowData) => {
        if (rowData.phone === undefined || rowData.phone === "") {
          return "Required";
        } else if (rowData.phone.length < 10 || rowData.phone.length > 10) {
          return "Phone number should contains 10 digits";
          //  return {isValid:false,helperText:"Phone number should contains 10 digits"}
        }
        return true;
      },
    },
    {
      title: "Gender",
      field: "gender",
      validate: (rowData) => ({ isValid: true, }),
    },
    {
      title: "Date",
      field: "createdAt",
      type: "date",
      dateSetting: { locale: "en-GB" },
      filterComponent: (props) => <CustomDatePicker {...props} />,
    },
  ];

  return (
    <div className="App">
      <MaterialTable
        title="User Data"
        data={data}
        columns={columns}
        editable={{
          onRowAdd:  async (data) => {
             await postData(data);
          },
          onRowDelete: async(data) => {
            await deleteData(data);
          },
          onRowUpdate:async (dataU) => {
            await patchData(dataU)
          },
        }}
        options={{
          actionsColumnIndex: -1,
          addRowPosition: "first",
        }}
      />
    </div>
  );
}

export default App;
