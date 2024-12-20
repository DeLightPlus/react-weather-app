import { useState } from 'react';

import './Header.css';
import { measure_units } from '../constants.js'
import { getCurrentDate } from '../../api/api.js';

const Header = ({ 
    isDark, setTheme, 
    tempUnits, setTempUnits,
    showTermsOfService,
    setShowTermsOfService }) =>
{
    //9728; &#127761; 
    const curDate = getCurrentDate();
    console.log('dt',curDate);

    const [openSettings, setOpenSettings] = useState(false);
    
    const handleMeasureUnits = (sys) =>
    {
        setTempUnits(sys);
        handleSearchSubmit();
        openSettings(false);
    }
    
    return(
        <div className="Header">
            <div className="logo-dt">
                <h2>Weather(24/7) </h2>
                <strong>{ curDate.day } , { curDate.time } </strong>
            </div>  

            <div className="settting">  
                <div className="btn-h-group">
                    { 
                        isDark ? <button onClick={() => { setTheme(!isDark) } }>
                                    <div className="icn">&#127768;</div>
                                </button> 
                        : <button onClick={() => { setTheme(!isDark) } }>
                            <div className="icn">&#127766;</div> 
                        </button> 
                    }                  
                    <button className={`setting-btn${openSettings ? '-fill' : ''}`}
                        onClick={() => {setOpenSettings((prev)=> !prev)}}          >
                        <div className="icn">&#128736;</div>
                    </button> {/*// &#128295;*/ }
                </div>
                
            </div>

            <div className={`setting-menu ${openSettings ? 'open' : ''}`}>
                <div>Set Measure Units:</div>
                <div className='systems'>                    
                    {
                        Object.values(measure_units).map((sys) =>
                        (
                            <div className={`system ${sys===tempUnits ? "active" : ""}`} key={sys}
                                onClick={() => { handleMeasureUnits(sys) }} >
                                {sys} </div>
                        )) 
                    }
                </div>
                <div><a onClick={()=>{setShowTermsOfService(!showTermsOfService)}}>Terms of service</a></div> 
            </div>

            
                    
        </div>        
    );
}

export default Header;