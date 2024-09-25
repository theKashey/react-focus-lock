import PropTypes from "prop-types";
import * as constants from "focus-lock/constants";
import { inlineProp } from "./util";
import { AutoFocusProps } from "./interfaces";

const AutoFocusInside = ({
  disabled = false,
  children,
  className = undefined,
}: AutoFocusProps) => (
  <div {...inlineProp(constants.FOCUS_AUTO, !disabled)} className={className}>
    {children}
  </div>
);

AutoFocusInside.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default AutoFocusInside;
