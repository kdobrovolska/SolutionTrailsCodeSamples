import React from 'react';
import { TrailFlags } from '../../Common/interfaces';
const IsMyTrailsOnlyContext = React.createContext<TrailFlags>({
    isMyTrails: false,
    isMyRunningTrails: false,
});
export default IsMyTrailsOnlyContext;