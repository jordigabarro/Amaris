
// Validamos el endpoint de lectura
// Lo ideal seria probar con el Id que devuelve el endpoint de registro, pero como este falla, usamos un Id fijo
// Hemos escogido el 4, porque sabemos que existe en la base de datos de reqres.in solomenet existen 12 usuarios

import { test, expect, request } from '@playwright/test';

test('Validate GET User by id', async () => {
    
    // Api Key para poder hacer la peticion
    const apiContext = await request.newContext({
        extraHTTPHeaders: {
            'x-api-key': 'reqres_f1168856b0d641e4b01ec11e94b20815',
            'Content-Type': 'application/json'
        }
    });

    //Petición
    const response = await apiContext.get('https://reqres.in/api/users/4');
    
    // Validacion status
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    console.log('RESPONSE:', responseBody);

    // Validación de datos
    expect(responseBody.data.id).toBe(4);
    expect(responseBody.data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
});