import React, { useEffect } from "react";
import { useState } from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Grid } from "@mui/material";

function GetItems() {
    const [itemArray,setitemArray] = useState([]);
    let returnData = [];
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      
    };
  
    fetch("http://localhost:3000/item/all", requestOptions)
    .then((response) => response.json())
    .then((data) => {
        Object.keys(data).forEach(function(key) {
            returnData.push(data[key]);
          });
          setitemArray(returnData)
    })

    

    

    return (
        <div  style={{ display: "flex", flexWrap: "wrap" }}>
            <Grid container spacing={2} backgroundColor= "lightblue">
            {itemArray.map((item) => {
                return (
                    <Grid item md={1.7}>
                    <Card>
                        <CardContent>
                    <div>ItemID: {item.id} </div>
                    <div>Item: {item.name}</div>
                    <div>Price: {item.price}</div>
                        </CardContent>
                    </Card></Grid>
                )
        })}</Grid></div>
    )
}

export default GetItems