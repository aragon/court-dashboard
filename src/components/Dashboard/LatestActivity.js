// import React from 'react'
// import { Box, GU, IdentityBadge, textStyle, useTheme } from '@aragon/ui'

// import Stepper from '../Stepper'
// import Step from '../Step'

// import { latestActivity } from '../../mock-data'

// function LatestActivity() {
//   const theme = useTheme()

//   return (
//     <Box heading="latest activity" padding={0}>
//       <Stepper
//         lineColor="#FFCDC5"
//         lineExtraHeight={10}
//         lineTop={15}
//         lineWidth={2}
//         css={`
//           padding: ${3 * GU}px 0;
//         `}
//       >
//         {latestActivity.map((activity, index) => (
//           <Step
//             key={index}
//             stepPoint={
//               <div
//                 css={`
//                   border-radius: 50%;
//                   border: 2px solid ${theme.accent.alpha(0.2)};
//                   padding: ${1 * GU}px;
//                 `}
//               >
//                 <span
//                   css={`
//                     display: block;
//                     padding: ${0.5 * GU}px;
//                     background: ${theme.accent};
//                     border-radius: 50%;
//                   `}
//                 />
//               </div>
//             }
//             content={
//               <div
//                 css={`
//                   line-height: 2;
//                 `}
//               >
//                 <IdentityBadge entity={activity.account} badgeOnly />
//                 <div>
//                   {activity.action}{' '}
//                   <a href={activity.target.link}>{activity.target.label}</a>
//                 </div>
//                 <div
//                   css={`
//                     ${textStyle('body4')};
//                     color: ${theme.contentSecondary};
//                   `}
//                 >
//                   {activity.date}
//                 </div>
//               </div>
//             }
//           />
//         ))}
//       </Stepper>
//     </Box>
//   )
// }

// export default LatestActivity
