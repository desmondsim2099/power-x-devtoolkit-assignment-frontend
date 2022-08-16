import './App.css';
import { useEffect, useState } from 'react';
import { ContextHolder } from '@frontegg/rest-api';
import { useAuth, useLoginWithRedirect } from "@frontegg/react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import GetItems from './GetItems';
import TextField from '@mui/material/TextField';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import { useRef } from 'react';
import { Grid } from "@mui/material";
import EnhancedTable from './ShopLog';



function checkEmail(userEmail, userName = "") {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    name: userEmail
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  fetch("http://localhost:3000/customer/id", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      if (result === "[]") {
        addUser(userEmail, userName)
        alert("Welcome New User, You have been Added to the Database")
      } 

    })
    .catch((error) => console.log("error", error));

}

function addUser(userEmail, userName = "") {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    name: userName,
    email: userEmail
  });

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
  };

  fetch("http://localhost:3000/customer/add", requestOptions);

}

function App() {
  const { user, isAuthenticated } = useAuth();
  const loginWithRedirect = useLoginWithRedirect();
  const [shopList, setShopList] = useState([]);
  const [shopLog, setShopLog] = useState([]);
  const itemIDInput = useRef(null);
  const itemQtyInput = useRef(null);
  const shippingAddrInput = useRef(null);

  async function getShopID() {
  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    var requestOptions = {
      method: "GET",
      headers: myHeaders
    };
    
  
    fetch("http://localhost:3000/shop/newID", requestOptions).then((result)=>result.json()).then((data)=>{buyShopItem(data[0]["max(id)"])})
    
  }

  const buyShopItem = (newID) => {
    let shopId = parseInt(newID)
    const currentDate = new Date().toISOString().slice(0, 10);
    let shippingDateRaw = new Date()
    shippingDateRaw.setDate(shippingDateRaw.getDate() + 7)
    const shippingDate = shippingDateRaw.toISOString().slice(0, 10);
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    shopList.forEach((item) => {
    shopId += 1
    var raw = JSON.stringify({
      id: shopId,
      custEmail: user?.email,
      itemID: item.itemID,
      quantity: item.quantity,
      address: item.address,
      order_date: currentDate,
      shipping_date: shippingDate
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
    };

    fetch("http://localhost:3000/shop/add", requestOptions);
    })

    setShopList([])
    alert("Items Purchased")
}



  // Uncomment this to redirect to login automatically
  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    } else {
      checkEmail(user?.email, user?.name)
      getShopLog()
    }
  }, [isAuthenticated, loginWithRedirect, user,getShopLog]);

  const logout = () => {
    const baseUrl = ContextHolder.getContext().baseUrl;
    window.location.href = `${baseUrl}/oauth/logout?post_logout_redirect_uri=${window.location}`;
  };

  const addToCart = () => {
    const tempData = JSON.parse(JSON.stringify(shopList)) // To Trigger Rendering of Shopping Cart
    tempData.push({ itemID: itemIDInput.current.value, quantity: itemQtyInput.current.value, address: shippingAddrInput.current.value })
    setShopList(tempData);
    itemIDInput.current.value = ""
    itemQtyInput.current.value = ""
    
  }

  async function getShopLog() {
  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      
      email: user?.email
      
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw
    };
    
  
    fetch("http://localhost:3000/shop/allOrders", requestOptions).then((result)=>result.json()).then((data)=>{setShopLog(data)})
    
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <Card sx={{ width: 0.2, boxShadow: 3 }} style={{ backgroundColor: "lightgrey" }} className="card">
              <CardContent>
                <div>
                  <img src={user?.profilePictureUrl} alt={user?.name} />
                </div>
                <div>
                  <span>Logged in as: {user?.name}</span>
                </div>
                <div>
                  <Button onClick={() => alert(user.accessToken)}>What is my access token?</Button>
                </div>
                <div>
                  <button >TESTER BUTTON</button>
                </div>
                <div>
                  <button onClick={() => console.log(shopLog)}>TESTER BUTTON 2</button>
                </div>
                <div>
                  <Button onClick={() => logout()}>Click to logout</Button>
                </div>
              </CardContent>
            </Card>
            <Card  sx={{ pt:3 , width: 0.2, boxShadow: 3 }}  >
            <FormControl  sx={{ width: '25ch' }}>
            <TextField inputRef={itemIDInput} label="Item ID" variant="outlined" />
            <TextField inputRef={itemQtyInput} label="Quantity" variant="outlined" />
            <TextField inputRef={shippingAddrInput} label="Shipping Address" variant="outlined" />
            <Button id="Add To Cart" variant="contained" onClick={addToCart}>Add To Cart</Button>
          </FormControl></Card>

            <Card sx={{ width: 0.6, boxShadow: 3 }}  >
              <CardContent>
                <Box sx={{ typography: 'subtitle2', fontWeight: 'bold', fontSize: 36 }}>SHOPPING LIST</Box>
                {shopList.map((item) => {
                  return(
                    <Grid item md={1.7}>
                  <Card>
                      ITEM ID: {item.itemID} ,
                      ITEM QTY: {item.quantity} ,
                      SHIPPING ADDR: {item.address}
                      
                  </Card></Grid>
                  )
                })}
                <Button variant="contained" onClick={getShopID}>BUY</Button>
              </CardContent>
            </Card>
         
          </div>
          <div>
            <GetItems />
          </div>
          <br />
          
          <div>
            <EnhancedTable rows = {shopLog}>
            </EnhancedTable>
          </div>
        </div>
        

      ) : (
        <div>
          <button onClick={() => loginWithRedirect()}>Click me to login</button>
        </div>
      )}
    </div>
  );
}

export default App;