import Loader from './Components/Loader/Loader'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
    <MuiThemeProvider>
        <div style={{height: '50vh', overflow: 'hidden', position:'absolute'}}> 
                    <Loader />

            </div>
    </MuiThemeProvider>,
    document.getElementsByTagName('body')[0]
);