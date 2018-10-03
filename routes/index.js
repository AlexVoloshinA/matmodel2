var express = require('express');
var router = express.Router();

function calculate(method) {

     let myK = 0;
     let arrayH = [], arrayT = [];
     let arrayHandT = [];

     let G =[],  m =[],  Iz =[],  C11 =[],  C22 =[],  C33 =[],  C44 =[],  C55 =[],  C66 =[],  C99 =[],  C1, C2, C3, C4, C5, C6, C9, DVB , DAB , DttZZ ;

    G[1] = 73000,
    G[2] = 68000,
    m[1] = G[1]/9.81,
    m[2] = G[2]/9.81;
    let p = 0.119,
    S = 201.45,
    V = 97.2,
    Xt1 = 0.24, Xt2 = 0.24,
    ba = 5.285,

    dXt =0,
    Kc =0.006,
    kn = 0.1,
    km = 0.5,
    T1 =20, T2 = 20,
    Hzad = 600,
    Lv = 10,
    Tv = Math.sqrt(2*Lv/0.3);

    Iz[1] = 660000;
    Iz[2] = 650000;

    C11[1] = 13/Iz[1] * p*V/2 *   S*ba*ba;
    C22[1] = 1.83/Iz[1] * p*V*V/2 *   S*ba;
    C33[1] = 0.96/Iz[1] * p*V*V/2 *   S*ba;
    C44[1] = (5.78 +0.13) * p*V * S/ (2*m[1]);//
    C55[1] = 3.8/Iz[1] * p*V/2 *  S*ba*ba;
    C66[1] = V/57.3;
    C99[1] = 0.2865 * p*V * S/(2*m[1]);//
    let C16 = V/(57.3*9.81);
    C11[2] = 13/Iz[2] * p*V/2 *   S*ba*ba;
    C22[2] = 1.83/Iz[2] * p*V*V/2 *   S*ba;
    C33[2] = 0.96/Iz[2] * p*V*V/2 *   S*ba;
    C44[2] = (5.78 +0.13) * p*V * S/ (2*m[2]);//
    C55[2] = 3.8/Iz[2] * p*V/2 *  S*ba*ba;
    C66[2] = V/57.3;
    C99[2] = 0.2865 * p*V * S/(2*m[2]);//

    let Cyb1 = 2*G[1] / (S * p * V*V);
    let Cyb2 = 2*G[2] / (S * p * V*V);
    let AB1 = 57.3 * ( (Cyb1 + 0.255) / 5.78 );
    let AB2 = 57.3 * ( (Cyb2 + 0.255) / 5.78 );
    let DVB1 = 57.3 * (( 0.2 + -1.83*AB1/57.3 + Cyb1*(Xt1 - 0.24)) / 0.96 );
    let DVB2 = 57.3 * (( 0.2 + -1.83*AB2/57.3 + Cyb2*(Xt2 - 0.24)) / 0.96 );

    let x = [],
    y = [],
    Ny = 0,
    AlfaZir = 0,
    DVZ = 0,
    dH = 0,
    dMz = 0;
    DttZZ = 0;
    for(let i = 0; i < 9; i++ ){
        x[i] = 0;
        y[i] = 0;
    }
    y[4] = 600;

    for (let T = 0; T < 200; T += 0.05) {

        if(T<Tv){
            C1 =  C11[1];
            C2 =  C22[1];
            C3 =  C33[1];
            C4 =  C44[1];
            C5 =  C55[1];
            C6 =  C66[1];
            C9 =  C99[1];
            DttZZ = 57.3 * dMz / 660000;
            DVB = 0;
            DAB = 0;

        }
        else{
            C1 =  C11[2];
            C2 =  C22[2];
            C3 =  C33[2];
            C4 =  C44[2];
            C5 =  C55[2];
            C6 =  C66[2];
            C9 =  C99[2];

            DVB = DVB1 - DVB2;
            DAB = AB1 - AB2;
            y[7] = 0;
            dXt = 0;
        }


        let dtt = y[0];
        let Sg = 0;
        let kint = 0.002;

        switch (method) {
            case 0:
                 Sg = 0;
                break;
            case 1:
                 Sg = kn * dH;
                break;
            case 2:
                 Sg = kn * dH + km*x[4];
                break;
            case 3:
                 Sg = kn * dH + dtt;
                break;
            case 4:
                 Sg = kn * dH + x[5];
                break;
            default:
                Sg  = kn * dH + km*x[4] + kint*y[6];
        }

        let DV = Sg +  y[1];
        let Cy = Cyb1 + 5.78*y[3]/57.3 + 0.2865*DV/57.3;
        dMz = Cy* dXt * S * ba * p*V*V/2;

        x[0] = y[1];
        x[1] = -C1 * x[0] - C2 * AlfaZir - C5 * x[3] - C3  * DVZ + DttZZ;
        x[2] = C4 * AlfaZir  + C9 * DVZ;
        x[3] = x[0] - x[2];
        x[4] = C6 * y[2];
        x[5] = dtt - y[5]/20;
        x[6] = dH;
        x[7] = y[8];
        x[8] = 0.3;
        dH = y[4] - Hzad;
        Ny = C16 * x[2];
        AlfaZir= y[3] + DAB;
        DVZ = DV + DVB;
        dXt = Kc * y[7];

        for (let i = 0; i < 9; i++) {

            y[i] += x[i] * 0.05;

        }

        arrayH[myK] = y[4];
        arrayT[myK] = T;

        myK++;
    }

    for (let i = 0; i < 4000; i++) {
        arrayHandT[i] = [];
        arrayHandT[i][1] = arrayH[i];
        arrayHandT[i][0] = arrayT[i];
    }

    return arrayHandT;
}

/* GET home page. */
router.get('/', function(req, res, next) {

    let arrayMethod1 = calculate(0);
    let arrayMethod2 = calculate(1);
    let arrayMethod3 = calculate(2);
    let arrayMethod4 = calculate(3);
    let arrayMethod5 = calculate(4);
    let arrayMethod6 = calculate(7);

    res.render('index', { title: 'Express',  with1method: arrayMethod1,  with2method: arrayMethod2, with3method: arrayMethod3, with4method: arrayMethod4, with5method: arrayMethod5, with6method: arrayMethod6 });
});

module.exports = router;





































/*
*
* //, dataResult6 = [], dataResult7 = [], dataResult8 = [], dataResult9 = [], dataResult10 = [],
* data6Y = [], data6X = [],  data7Y = [], data7X = [],  data8Y = [], data8X = [],  data9Y = [], data9X = [],  data10Y = [], data10X = [],  dataResult1 = [], dataResult2 = [], dataResult3 = [], dataResult4 = [],
*
*
*      data1Y[myK] = y[0];
        data1X[myK] = T;

        data2Y[myK] = y[1];
        data2X[myK] = T;

        data3Y[myK] = y[2];
        data3X[myK] = T;

        data4Y[myK] = y[3];
        data4X[myK] = T;
*
*         dataResult1[i] = [];
        dataResult1[i][1] = data1Y[i];
        dataResult1[i][0] = data1X[i];

        dataResult2[i]= [];
        dataResult2[i][1] = data2Y[i];
        dataResult2[i][0] = data2X[i];

        dataResult3[i]= [];
        dataResult3[i][1] = data3Y[i];
        dataResult3[i][0] = data3X[i];

        dataResult4[i]= [];
        dataResult4[i][1] = data4Y[i];
        dataResult4[i][0] = data4X[i];
        //info[i] = dataResult5[i];

        dataResult6[i] = [];
        dataResult6[i][1] = data6Y[i];
        dataResult6[i][0] = data6X[i];

        dataResult7[i] = [];
        dataResult7[i][1] = data7Y[i];
        dataResult7[i][0] = data7X[i];

        dataResult8[i] = [];
        dataResult8[i][1] = data8Y[i];
        dataResult8[i][0] = data8X[i];

        dataResult9[i] = [];
        dataResult9[i][1] = data9Y[i];
        dataResult9[i][0] = data9X[i];

        dataResult10[i] = [];
        dataResult10[i][1] = data10Y[i];
        dataResult10[i][0] = data10X[i];




        data6Y[myK] = y[5];
        data6X[myK] = T;

        data7Y[myK] = y[6];
        data7X[myK] = T;

        data8Y[myK] = Ny;
        data8X[myK] = T;

        data9Y[myK] = Ny;
        data9X[myK] = T;

        data10Y[myK] = Ny;
        data10X[myK] = T;
*
* */