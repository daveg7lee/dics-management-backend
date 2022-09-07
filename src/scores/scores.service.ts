import { Injectable } from '@nestjs/common';
import { ScoreType } from '@prisma/client';
import { CoreOutput } from '../common/dtos/output.dto';
import prisma from '../prisma';
import { CreateScoreInput, ScoreOutput } from './dto/create-score.input';
import { ScoresOutput } from './dto/scores.dto';

@Injectable()
export class ScoresService {
  async create({
    score,
    article,
    type,
    date,
    uploader,
    detail,
    username,
  }: CreateScoreInput): Promise<ScoreOutput> {
    try {
      const userExists = await prisma.user.findUnique({ where: { username } });

      if (!userExists) {
        throw new Error('존재하지 않는 학생입니다.');
      }

      const createdScore = await prisma.score.create({
        data: {
          score,
          article,
          type,
          user: { connect: { username } },
          date,
          uploader,
          detail,
        },
      });

      // if (userExists.email && type === 'Demerit') {
      //   await nodeoutlook.sendEmail({
      //     auth: {
      //       user: process.env.MAIL_ADDRESS,
      //       pass: process.env.MAIL_PASSWORD,
      //     },
      //     from: process.env.MAIL_ADDRESS,
      //     to: userExists.email,
      //     subject: `벌점 ${score}점이 입력되었습니다.`,
      //     html: `<!DOCTYPE html>
      //     <html
      //       xmlns:v="urn:schemas-microsoft-com:vml"
      //       xmlns:o="urn:schemas-microsoft-com:office:office"
      //       lang="en"
      //     >
      //       <head>
      //         <title></title>
      //         <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      //         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      //         <style>
      //           * {
      //             box-sizing: border-box;
      //           }

      //           body {
      //             margin: 0;
      //             padding: 0;
      //           }

      //           a[x-apple-data-detectors] {
      //             color: inherit !important;
      //             text-decoration: inherit !important;
      //           }

      //           #MessageViewBody a {
      //             color: inherit;
      //             text-decoration: none;
      //           }

      //           p {
      //             line-height: inherit;
      //           }

      //           .desktop_hide,
      //           .desktop_hide table {
      //             mso-hide: all;
      //             display: none;
      //             max-height: 0px;
      //             overflow: hidden;
      //           }

      //           @media (max-width: 520px) {
      //             .desktop_hide table.icons-inner {
      //               display: inline-block !important;
      //             }

      //             .icons-inner {
      //               text-align: center;
      //             }

      //             .icons-inner td {
      //               margin: 0 auto;
      //             }

      //             .row-content {
      //               width: 100% !important;
      //             }

      //             .mobile_hide {
      //               display: none;
      //             }

      //             .stack .column {
      //               width: 100%;
      //               display: block;
      //             }

      //             .mobile_hide {
      //               min-height: 0;
      //               max-height: 0;
      //               max-width: 0;
      //               overflow: hidden;
      //               font-size: 0px;
      //             }

      //             .desktop_hide,
      //             .desktop_hide table {
      //               display: table !important;
      //               max-height: none !important;
      //             }
      //           }
      //         </style>
      //       </head>

      //       <body
      //         style="
      //           background-color: #ffffff;
      //           margin: 0;
      //           padding: 0;
      //           -webkit-text-size-adjust: none;
      //           text-size-adjust: none;
      //         "
      //       >
      //         <table
      //           class="nl-container"
      //           width="100%"
      //           border="0"
      //           cellpadding="0"
      //           cellspacing="0"
      //           role="presentation"
      //           style="
      //             mso-table-lspace: 0pt;
      //             mso-table-rspace: 0pt;
      //             background-color: #ffffff;
      //           "
      //         >
      //           <tbody>
      //             <tr>
      //               <td>
      //                 <table
      //                   class="row row-1"
      //                   align="center"
      //                   width="100%"
      //                   border="0"
      //                   cellpadding="0"
      //                   cellspacing="0"
      //                   role="presentation"
      //                   style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
      //                 >
      //                   <tbody>
      //                     <tr>
      //                       <td>
      //                         <table
      //                           class="row-content stack"
      //                           align="center"
      //                           border="0"
      //                           cellpadding="0"
      //                           cellspacing="0"
      //                           role="presentation"
      //                           style="
      //                             mso-table-lspace: 0pt;
      //                             mso-table-rspace: 0pt;
      //                             color: #000000;
      //                             width: 500px;
      //                           "
      //                           width="500"
      //                         >
      //                           <tbody>
      //                             <tr>
      //                               <td
      //                                 class="column column-1"
      //                                 width="100%"
      //                                 style="
      //                                   mso-table-lspace: 0pt;
      //                                   mso-table-rspace: 0pt;
      //                                   font-weight: 400;
      //                                   text-align: left;
      //                                   vertical-align: top;
      //                                   padding-top: 5px;
      //                                   padding-bottom: 5px;
      //                                   border-top: 0px;
      //                                   border-right: 0px;
      //                                   border-bottom: 0px;
      //                                   border-left: 0px;
      //                                 "
      //                               >
      //                                 <table
      //                                   class="image_block block-1"
      //                                   width="100%"
      //                                   border="0"
      //                                   cellpadding="0"
      //                                   cellspacing="0"
      //                                   role="presentation"
      //                                   style="
      //                                     mso-table-lspace: 0pt;
      //                                     mso-table-rspace: 0pt;
      //                                   "
      //                                 >
      //                                   <tr>
      //                                     <td
      //                                       class="pad"
      //                                       style="
      //                                         width: 100%;
      //                                         padding-right: 0px;
      //                                         padding-left: 0px;
      //                                       "
      //                                     >
      //                                       <div
      //                                         class="alignment"
      //                                         align="center"
      //                                         style="line-height: 10px"
      //                                       >
      //                                         <img
      //                                           src="https://d15k2d11r6t6rl.cloudfront.net/public/users/BeeFree/beefree-sufs7o3ho4/editor_images/unnamed.png"
      //                                           style="
      //                                             display: block;
      //                                             height: auto;
      //                                             border: 0;
      //                                             width: 85px;
      //                                             max-width: 100%;
      //                                           "
      //                                           width="85"
      //                                         />
      //                                       </div>
      //                                     </td>
      //                                   </tr>
      //                                 </table>
      //                                 <table
      //                                   class="heading_block block-2"
      //                                   width="100%"
      //                                   border="0"
      //                                   cellpadding="10"
      //                                   cellspacing="0"
      //                                   role="presentation"
      //                                   style="
      //                                     mso-table-lspace: 0pt;
      //                                     mso-table-rspace: 0pt;
      //                                   "
      //                                 >
      //                                   <tr>
      //                                     <td class="pad">
      //                                       <h1
      //                                         style="
      //                                           margin: 0;
      //                                           color: #555555;
      //                                           font-size: 23px;
      //                                           font-family: Arial, Helvetica Neue,
      //                                             Helvetica, sans-serif;
      //                                           line-height: 120%;
      //                                           text-align: center;
      //                                           direction: ltr;
      //                                           font-weight: 700;
      //                                           letter-spacing: normal;
      //                                           margin-top: 0;
      //                                           margin-bottom: 0;
      //                                         "
      //                                       >
      //                                         <span class="tinyMce-placeholder"
      //                                           >DICS Student</span
      //                                         >
      //                                       </h1>
      //                                     </td>
      //                                   </tr>
      //                                 </table>
      //                                 <table
      //                                   class="paragraph_block block-3"
      //                                   width="100%"
      //                                   border="0"
      //                                   cellpadding="20"
      //                                   cellspacing="0"
      //                                   role="presentation"
      //                                   style="
      //                                     mso-table-lspace: 0pt;
      //                                     mso-table-rspace: 0pt;
      //                                     word-break: break-word;
      //                                   "
      //                                 >
      //                                   <tr>
      //                                     <td class="pad">
      //                                       <div
      //                                         style="
      //                                           color: #000000;
      //                                           font-size: 16px;
      //                                           font-family: Arial, Helvetica Neue,
      //                                             Helvetica, sans-serif;
      //                                           font-weight: 400;
      //                                           line-height: 120%;
      //                                           text-align: center;
      //                                           direction: ltr;
      //                                           letter-spacing: 0px;
      //                                           mso-line-height-alt: 19.2px;
      //                                         "
      //                                       >
      //                                         <p style="margin: 0; margin-bottom: 15px">
      //                                           다음과 같은 사유로 벌점 ${score}점이
      //                                           부과되었습니다.
      //                                         </p>
      //                                         <p style="margin: 0">
      //                                           <strong>${article}</strong>
      //                                           <strong>${detail}</strong>
      //                                         </p>
      //                                       </div>
      //                                     </td>
      //                                   </tr>
      //                                 </table>
      //                                 <table
      //                                   class="button_block block-4"
      //                                   width="100%"
      //                                   border="0"
      //                                   cellpadding="10"
      //                                   cellspacing="0"
      //                                   role="presentation"
      //                                   style="
      //                                     mso-table-lspace: 0pt;
      //                                     mso-table-rspace: 0pt;
      //                                   "
      //                                 >
      //                                   <tr>
      //                                     <td class="pad">
      //                                       <div class="alignment" align="center">
      //                                         <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://dics-frontend.vercel.app" style="height:38px;width:116px;v-text-anchor:middle;" arcsize="11%" stroke="false" fillcolor="#1e293b"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:14px"><!
      //                                         [endif]--><a
      //                                           href="https://dics-frontend.vercel.app"
      //                                           target="_blank"
      //                                           style="
      //                                             text-decoration: none;
      //                                             display: inline-block;
      //                                             color: #ffffff;
      //                                             background-color: #1e293b;
      //                                             border-radius: 4px;
      //                                             width: auto;
      //                                             border-top: 1px solid #1e293b;
      //                                             font-weight: 400;
      //                                             border-right: 1px solid #1e293b;
      //                                             border-bottom: 1px solid #1e293b;
      //                                             border-left: 1px solid #1e293b;
      //                                             padding-top: 5px;
      //                                             padding-bottom: 5px;
      //                                             font-family: Arial, Helvetica Neue,
      //                                               Helvetica, sans-serif;
      //                                             text-align: center;
      //                                             mso-border-alt: none;
      //                                             word-break: keep-all;
      //                                           "
      //                                           ><span
      //                                             style="
      //                                               padding-left: 20px;
      //                                               padding-right: 20px;
      //                                               font-size: 14px;
      //                                               display: inline-block;
      //                                               letter-spacing: normal;
      //                                             "
      //                                             ><span
      //                                               dir="ltr"
      //                                               style="
      //                                                 word-break: break-word;
      //                                                 line-height: 28px;
      //                                               "
      //                                               >벌점 확인하기</span
      //                                             ></span
      //                                           ></a
      //                                         >
      //                                         <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
      //                                       </div>
      //                                     </td>
      //                                   </tr>
      //                                 </table>
      //                               </td>
      //                             </tr>
      //                           </tbody>
      //                         </table>
      //                       </td>
      //                     </tr>
      //                   </tbody>
      //                 </table>
      //               </td>
      //             </tr>
      //           </tbody>
      //         </table>
      //         <!-- End -->
      //       </body>
      //     </html>`,
      //     text: article,
      //     replyTo: 'dicscouncil@gmail.com',
      //   });
      // }

      return { success: true, score: createdScore };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async createByGrade({
    score,
    article,
    type,
    date,
    uploader,
    detail,
    grade,
  }: CreateScoreInput): Promise<ScoreOutput> {
    try {
      const users = await prisma.user.findMany({ where: { grade } });

      await Promise.all(
        users.map(async (user) => {
          await prisma.score.create({
            data: {
              score,
              article,
              type,
              user: { connect: { username: user.username } },
              date,
              uploader,
              detail,
            },
            include: { user: true },
          });
        }),
      );

      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  }

  async remove(id: string): Promise<ScoreOutput> {
    try {
      const score = await prisma.score.delete({ where: { id } });

      return { success: true, score };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async search(term: string): Promise<ScoresOutput> {
    try {
      const scores = await prisma.score.findMany({
        where: { uploader: { startsWith: term } },
        include: { user: true },
      });

      return {
        success: true,
        scores,
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async reset(type: ScoreType): Promise<CoreOutput> {
    try {
      await prisma.score.deleteMany({ where: { type } });

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}
