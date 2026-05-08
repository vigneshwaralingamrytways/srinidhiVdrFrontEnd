import classes from '../CommonImports/Common.module.css'

const LoadingPopup=({showPopup=false})=>{

    return (
        showPopup && (
            <div className={classes.loadingOverlay}>
              <div className={classes.loader}></div>
              <p>Loading...</p>
            </div>
          )
    )
}
export default LoadingPopup;
