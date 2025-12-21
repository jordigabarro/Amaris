
// Este test fallará ya que el status que estamos validando no es el correcto. Se ha diseñado el test como si fuera correcto
// El Endppoint falla porque la API KEY no tiene permisos de crear o modificar, solo lectura


import { test, expect, request } from '@playwright/test';

test('Validate POST register', async () => {
    
    // Api Key para poder hacer la peticion
    const apiContext = await request.newContext({
        extraHTTPHeaders: {
            'x-api-key': 'reqres_f1168856b0d641e4b01ec11e94b20815',
            'Content-Type': 'application/json'
        }
    });

    //Petición + Data que enviamos
    const response = await apiContext.post('https://reqres.in/api/register', {
        data: {
            username: 'Morpheus',
            email: 'morpheus@gmail.com',
            password: 'm4tr1x!'
        }
    });

    // Validacion status
    expect(response.status()).toBe(200);

    
    const responseBody = await response.json();
    console.log('RESPONSE:', responseBody);

    // Validación de datos
    expect(responseBody).toHaveProperty('id');
    expect(responseBody).toHaveProperty('token');
});