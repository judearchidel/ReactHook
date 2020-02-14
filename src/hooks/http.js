import { useCallback, useReducer } from "react"


const intialstate =  {
    loading: false, 
    error: null,
    data: null,
    extra: null,
    identifier: null
    }

const httpreducer = (prevhttpstate,action)=>{
    switch(action.type){
      case 'SEND':
        return{
          loading: true,
          error: null,
          data: null,
          extra: null,
          identifier: null
        }
      case 'RESPONSE':
        return{
          ...prevhttpstate,
          loading: false,
          data: action.responseData,
          extra: action.extra,
          identifier: action.identifier
        }
      case 'ERROR':
        return {
          loading: false,
          data: null,
          error: action.errorData,
          extra: null,
          identifier: null
        }
      case 'REMOVE_ERROR':
        return{
          ...prevhttpstate,
          error: null
        }
      case 'CLEAR':
          return intialstate
      default:
        throw new Error('should not reach here');    
    }
  }

const useHttp =()=>{
    const [httpstate, dispatchHttp]= useReducer(httpreducer,
        intialstate)

    const clear = useCallback(()=>{dispatchHttp({type: 'CLEAR'})},[]);    

    const senddata = useCallback((url,method,body,extra,identifier)=>{
        dispatchHttp({type: 'SEND'})
          fetch(url,{
           method: method,
           body: body,
           headers: {
               'Content-Type': 'application/json'
           }
         }).then(response=> {
         return response.json()
         })
         .then(responseData => {
            dispatchHttp({
                type: 'RESPONSE',
                responseData: responseData,
                extra: extra,
                identifier: identifier
            })
         })
         .catch(error=>{
           dispatchHttp({
            type: 'ERROR',
            errorData: error.message
          })
         })
    },[]);

    return {
        isloading: httpstate.loading,
        data: httpstate.data,
        error: httpstate.error,
        senddata: senddata,
        reqextra: httpstate.extra,
        identifier: httpstate.identifier,
        clear: clear
    };
};

export default useHttp;