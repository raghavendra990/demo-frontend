import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import fetcher  from './utils/fetch'
import apiMapper from "./utils/apiMapper";
import common  from "./utils/common";
const Login =({meta})=>{
    const navigate = useNavigate();
    const passwordRef = useRef();
    const [loading, setLoading] = useState(false);
    const [heading, setHeading] =  useState('Login')
    useEffect(()=>{
        if(meta){
            setHeading(meta);
        }

        if(localStorage.getItem('Authorization')){
            navigate('/');
            navigate(0)
        }
    }, [])

    // const loginDataHandler = (data)=>{

    // }

    const handlerLogin = async (event)=>{
        event.preventDefault();
        // setLoading(true);
        const username = event.target.username.value;
        const password = event.target.password.value;
    
    
        if (username && password) {
          const resp = await fetcher.post(meta === 'Register' ? apiMapper.REGISTRATION_API : apiMapper.LOGIN_API, { username, password });
          if ([200, 201].includes(resp?.status)) {
            if(meta === 'Register'){
                alert('Registration successful, Please login now.')
                navigate('/login');
                navigate(0);
            } else {
                const respdata = resp.data;
                const token = respdata?.token;
                console.log('respdata', respdata, resp, token)
                if (token) {
                localStorage.setItem("Authorization", token);
                
        
                setTimeout(() => {
                    setLoading(false);
                    common.resetForm(event);
                    navigate('/')
                    navigate(0);
                }, 1000);
                }
            }
            
    
          } else {
            setLoading(false);
            event.target.username.classList.add('is-invalid');
          }
        }    
    }

    const passwordViewhandler = () => {
        if (passwordRef.current.type === "password") {
          passwordRef.current.type = "text";
        } else {
          passwordRef.current.type = "password";
        }
    
      }

    return <>
    <div className="container mt-5">
    <div className="row">
        <div className="col-4"></div>
        <div className="col-4">
            <h1>{heading}</h1>
        <form onSubmit={handlerLogin} className="needs-validation user-login">
                    <div className="mb-3">
                      {/* <label htmlFor="recipient-name" className="col-form-label">Login:</label> */}
                      <input type="text" className="form-control" id="username" placeholder="Username" required />
                      <div className="invalid-feedback">
                        Username or Password is wrong.
                      </div>
                    </div>
                    <div className="mb-3">
                      {/* <label htmlFor="password" className="col-form-label">Password:</label> */}
                      <div className="input-group">
                        <input ref={passwordRef}  type="password" className="form-control" id="password" placeholder="Password" minLength="8" required />
                        <span className="input-group-btn">
                          <button className="btn btn-default reveal border border-start-0 rounded-start-0 " type="button" onClick={passwordViewhandler}><i className="bi bi-eye"></i></button>
                        </span>
                      </div>

                      <div className="invalid-feedback">
                        Password is not entered or its not valid.
                      </div>

                      <div className="col mt-4" style={{ alignSelf: "start" }}>
                        {loading === false ? <button className="btn btn-primary"  >Login</button>
                          : <button type="button" className="btn btn-primary " disabled>
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </button>}
                      </div>
                    </div>

    </form>
        </div>
        <div className="col-4"></div>
    </div>
    
    </div>
       
        
    </>
}
export default Login;