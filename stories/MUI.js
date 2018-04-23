import React, {Component} from "react";
import {createPortal} from 'react-dom';

import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import FocusLock from "../src/index";

export const MUISelect = () => (
  <div>
    <h2>With focus lock active</h2>
    <h3>
      will not work, as long MUI user "RenderLayer", not portal
    </h3>
    <MuiThemeProvider>
      <FocusLock noFocusGuards persistentFocus={true}>
        <SelectField floatingLabelText="Frequency">
          <MenuItem value={1} primaryText="Never"/>
          <MenuItem value={2} primaryText="Every Night"/>
          <MenuItem value={3} primaryText="Weeknights"/>
          <MenuItem value={4} primaryText="Weekends"/>
          <MenuItem value={5} primaryText="Weekly"/>
        </SelectField>
      </FocusLock>
      <br/>
    </MuiThemeProvider>
  </div>
);