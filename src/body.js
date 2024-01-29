import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import fetcher  from './utils/fetch'
import apiMapper from "./utils/apiMapper";
import common  from "./utils/common";
import config from "./utils/config";

const Body =() => {
    const navigate = useNavigate();
    const [ item, setItem] = useState([]);
    const ref = useRef();
    const [getContent, setContent] = useState([]);
    const [type, setType] = useState("add");
    const clearForm = {
        "name": "",
        "price": "",
      }
    const [formstate, setFormstate] = useState(clearForm);
    const [summary, setSummary] = useState();

    const getItems = async ()=>{
        const resp = await fetcher.get(apiMapper.ITEMS_API , config.host, common.getHeaders());
        if ([200, 201].includes(resp?.status)) {
            const userList = resp.data || [];
            setItem(userList)
        }
        getSummary()
    }
    const getSummary = async ()=>{
        const resp = await fetcher.get(apiMapper.SUMMARY_API , config.host, common.getHeaders());
        if ([200, 201].includes(resp?.status)) {
            const summaryData = resp.data?.amount ;
            if(summaryData){
                setSummary(summaryData)
            }
        }
    }
    useEffect( ()=>{
        const token = localStorage.getItem('Authorization');
        getItems()
    }, [])

    const saveChangeHandler = async (event, type = 'add') => {
        event.preventDefault();
        
    
        const name = event.target.name.value;
        const price = event.target.price.value;
    
        
        const headers = common.getHeaders();
    
        let responseNewContent = null;
        if (type === "add") {
          responseNewContent = await fetcher.post(apiMapper.ITEMS_API, { name, price }, config.host, headers);
        } else {
          responseNewContent = await fetcher.patch(`${apiMapper.ITEM_API}/${formstate.id}` , {_id:formstate.id ,name, price }, config.host, headers);
    
        }
    
    
        if ([200, 201].includes(responseNewContent?.status)) {
    
          setFormstate(clearForm);
          await getItems();
    
          ref.current.click();
    
    
        } else if ([400].includes(responseNewContent?.status)) {
          return (<h2>Rule All ready Present </h2>)
        }
        else if (responseNewContent.status === 401) {
          localStorage.clear();
          localStorage.clear();
          ref.current.click();
          navigate('/admin/login');
        }
      }
    
      //Edit handler
    // const editHandler = (id, title, contentDescription, slug) => {
    
    // console.log({ ...formstate, id, title, contentDescription, slug })
    // setFormstate({ ...formstate, id, title, contentDescription, slug });
    // setContentDescription(contentDescription);
    // setType("edit");

    // }
    



    const delete_handler = async (id)=>{
        await fetcher.delete(`${apiMapper.ITEM_API}/${id}` , { }, config.host, common.getHeaders());
        getItems();
    }
    const popupCreateEdit = (type = "add") => {
        return <div className="modal fade" id="addNewRuleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">{type === "add" ? "Add Item" : "Edit Item"}</h5>
                <button ref={ref} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
    
              <form onSubmit={(e) => { saveChangeHandler(e, type) }}>
                <div className="modal-body">
                  <div className="row">
                    <div className="mb-3 mt-3">
                      <div className="mb-3">
                        <input onChange={(e) => { setFormstate({ ...formstate, name: e.target.value }) }}
                          value={formstate.name} type="text" className="form-control" id="name" name="name" placeholder="Name" required />
                      </div>
        
                      <div className="mb-3">
                        <input onChange={(e) => { setFormstate({ ...formstate, price: e.target.value }) }}
                          value={formstate.price} type="text" className="form-control" id="price" name="price" placeholder="Price" required />
                      </div>
    
    
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary">{type === "add" ? "Create" : "Update"}</button>
                </div>
              </form>
    
    
            </div>
          </div>
        </div>
      }
    const summaryPopUp = ()=>{
        return <>
            <div className="modal fade" id="summaryModal" tabindex="-1" aria-labelledby="summaryModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title" id="exampleModalLabel">Summary</h2>
                <button ref={ref} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="container text-center">                <h5>Final Amount is: {summary}</h5>
</div>
    
            </div>
          </div>
        </div>
        </>
    }
    return <>
        {localStorage.getItem('Authorization') ? <div className="container">
            <div className="row">
                    
                <div className="col-2">
                    <button type="button" className="btn btn-success" onClick={()=>{setType('add');
                setFormstate(clearForm)}} data-bs-toggle="modal" data-bs-target="#addNewRuleModal">Add +</button>
                </div>
            </div>
            <table className="table table-bordered mt-2">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th className="text-center">
                  Price
                </th>
                <th className="text-center">
                  Action
                </th>
              
              </tr>
            </thead>
            <tbody>
              {item?.map((ele, i) => {
                return item.length === 0 ? (<><h2> Loading.......</h2></>) : (<>
                  <tr key={ele?.userId?._id}>
                    <td>{(i + 1) }</td>
                    <td>{ele?.name}</td>
                    <td>{ele?.price}</td>
                    
                    <td>
                      {/* {console.log("designation", ele?.designation === "User")} */}
                      <button onClick={() => {
                    setType('edit');
                    setFormstate({...setFormstate, id:ele.id, name:ele.name, price:ele.price})  }} className="btn btn-secondary"  data-bs-toggle="modal" data-bs-target="#addNewRuleModal"> <i className="bi bi-pencil-square"></i>
                    </button>
                      <button onClick={() => { delete_handler(ele.id)  }} className="btn btn-danger ms-2">  <i className="bi bi-trash-fill"></i></button>

                    </td>

                  </tr>
                </>)
              })}
            </tbody>
          </table>
          {popupCreateEdit(type)}
        {summaryPopUp()}
        <div className="row">
            <div className="col-4"></div>
            <div className="col-4">
                <button type="button" className="btn btn-success" onClick={()=>{getSummary()}} data-bs-toggle="modal" data-bs-target="#summaryModal"> Get Summary</button>
            </div>
            <div className="col-4"></div>


        </div>
        </div> : <div className="conatiner text-center mt-5">
              <h1>Please Login/Signup to access this page</h1>
            </div>}
        
    </>
}
export default Body;