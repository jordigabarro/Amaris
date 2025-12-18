import { test, expect } from '@playwright/test';

test('Página Principal', async ({ page }) => {
    
    // Url para realizar las pruebas y la espera de que este todo bien cargado antes de empezar
    await page.goto('https://www.renfe.com/es/es', { waitUntil: 'networkidle' });

    // Comprobamos que estamos en la pagina principal comprobando que existe el botón de venta de billetes
    await expect(page.locator('#ticketSearchBt')).toBeVisible();
    // Aceptamos el botón de cookies
    await page.click('#onetrust-accept-btn-handler');

    // Introucimos MADRID/Barcelona el textfield. Se ha tenido que hacer de esta forma ya que si solamente hacia el fill el botón no se activaba
    await page.fill('#origin', 'MADRID');
    await page.waitForSelector('#awesomplete_list_1 li:has-text("ALMUDENA GRANDES")');
    await page.click('#awesomplete_list_1 li:has-text("ALMUDENA GRANDES")');

    await page.fill('#destination', 'BARCELONA');
    await page.waitForSelector('#awesomplete_list_2 li:has-text("SANTS")');
    await page.click('#awesomplete_list_2 li:has-text("SANTS")');

    // Click en el input de la fecha y selección de solo un viaje
    await page.click('#first-input');
    await page.click('label[for="trip-go"]');
    //await page.click('.lightpick__day[data-time="1767135600000"]'); //31 de Diciembre 2025
    //await page.locator('.lightpick__day', { hasText: '31' }).click();
    //await page.locator('div', { hasText: '3148€' }).first().click();


    //await page.getByRole('button', { name: 'Aceptar' }).click();
    //await page.locator('.lightpick__apply-action-sub', { hasText: 'Aceptar' }).first().click();
    //await page.locator('.lightpick__apply-action-sub', { hasText: 'Aceptar' }).filter({ hasText: 'Aceptar' }).first().click();


    //Muchos problemas con el calendario
    //- Problemas al seleccionar el dia en el calendario
    //- Problemas con el botón aceptar del calendario

    // Validación de que se ha activado el botón de la venta de billetes y posterior click
    await expect(page.locator('#ticketSearchBt')).toBeEnabled();
    await page.click('#ticketSearchBt');

    // Validación que a la url que vamos es la correcta
    await expect(page).toHaveURL(/buscarTrenEnlaces/);

    // Guardamos el estado para poder utilizarlo en los otros test. De esta forma los tests se pueden mantener mejor y no son tan largos
    await page.context().storageState({ path: 'renfe-state.json' });
});








