import React,{useReducer, useState,useCallback, useMemo, useEffect} from 'react';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorHandler from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';


const ingredientreducer = (currentIngredients,action)=>{
  switch(action.type){
    case 'SET':
    return action.ingrdients;
    case 'ADD':
    return [...currentIngredients,action.ingredients];
    case 'DELETE':  
    return currentIngredients.filter(item =>{
      return action.id !== item.id
    })
    default:
      throw new Error('Should not reach here')
  }
}
/*
const httpreducer = (prevhttpstate,action)=>{
  switch(action.type){
    case 'SEND':
      return{
        loading: true,
        error: null
      }
    case 'RESPONSE':
      return{
        ...prevhttpstate,
        loading: false
      }
    case 'ERROR':
      return {
        loading: false,
        error: action.errorData
      }
    case 'REMOVE_ERROR':
      return{
        ...prevhttpstate,
        error: null
      }
    default:
      throw new Error('should not reach here');    
  }
}*/

const Ingredients=() =>  {
 const [userIngredients,dispatch] = useReducer(ingredientreducer,[]);
 const {isloading,error,data,senddata,reqextra,identifier} = useHttp();

 //const [httpstate, dispatchHttp]= useReducer(httpreducer,{loading: false, error: null})
 //const [userIngredients, setUserIngredients] = useState([]);
 //const [isloading, setisloadng]= useState(false);
 //const [error,setError]= useState();

useEffect(()=>{
  if(identifier === 'remove'){
  dispatch({type: 'DELETE',
  id: reqextra})
  }
  else if(identifier === 'add')
  {console.log(data)
    dispatch({
      type: 'ADD',
      ingredients: {
        id: data.name,
        ...reqextra
      }
  })
  }
},[data,reqextra])

const addIngredients = useCallback(ingrdients => {
 // setisloadng(true);
 //dispatchHttp({
  // type: 'SEND'
 //})
 senddata('https://reacthook-cb5b7.firebaseio.com/ingredients.json','POST',JSON.stringify(ingrdients),ingrdients,'add')
 //fetch('https://reacthook-cb5b7.firebaseio.com/ingredients.json',{
  // method: 'POST',
  // body: ,
  // headers: {'Content-Type': 'application/json'}
 //}).then(response=> {
   //setisloadng(false);
  // dispatchHttp({
   //  type: 'RESPONSE'
   //})
  // return response.json()
 //}).then(responseData => {
  /*setUserIngredients(prevIngredients => [
    ...prevIngredients,{
      id: responseData.name,
      ...ingrdients
    }
  ]);*/
 /* dispatch({
    type: 'ADD',
    ingredients: {
      id: responseData.name,
      ...ingrdients
    }
  })*/
 //}).catch(error =>{
   //setError(error.message);
   /*dispatchHttp({
     type: 'ERROR',
     errorData: error.message
   })
   //setisloadng(false);
 })*/
//})
}, [senddata]);

const removeIngredients = useCallback((id) => {
  
  senddata(`https://reacthook-cb5b7.firebaseio.com/ingredients/${id}.json`,'DELETE',null,id,'remove')
  //setisloadng(true);
 /* dispatchHttp({
    type: 'SEND'
  })
  fetch(`https://reacthook-cb5b7.firebaseio.com/ingredients/${id}.json`,{
   method: 'DELETE',
 }).then(response=> {
  dispatchHttp({
    type: 'RESPONSE'
  })
  //setisloadng(false);
 //  setUserIngredients(prevIngredients => prevIngredients.filter(item =>{
 //  return item.id !== id 
//  }))
dispatch({
  type: 'DELETE',
  id: id
});
 }).catch(error=>{
   //setError(error.message);
   //setisloadng(false);
   dispatchHttp({
    type: 'ERROR',
    errorData: error.message
  })
 })*/
},[senddata]);

const filteringDataHandler = useCallback((loadedData)=>{
 //setUserIngredients(loadedData);
 dispatch({
 type: 'SET',
  ingrdients: loadedData
})
},[])

const closeErrormodal = useCallback(()=>{
  //dispatchHttp({
  //  type: 'REMOVE_ERROR'
 // })
  
});
const ings = useMemo(()=>{
  return(
    <IngredientList ingredients={userIngredients}  onRemoveItem={removeIngredients}/>
  )
},[userIngredients,removeIngredients])

  return (
    <div className="App">
    {error && <ErrorHandler onClose={closeErrormodal}>{error}</ErrorHandler>}
      <IngredientForm onaddIngredients={addIngredients} loading={isloading}/>

      <section>
        <Search  onFilteringData={filteringDataHandler}/>
        {ings}
      </section>
    </div>
  );
}

export default Ingredients;
