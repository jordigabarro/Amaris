import { test, expect } from '@playwright/test';

test.use({ storageState: 'renfe-state.json' });
test('Página Venta', async ({ page }) => {
    // Url para realizar las pruebas y la espera de que este todo bien cargado antes de empezar
    await page.goto('https://venta.renfe.com/vol/buscarTrenEnlaces.do', { waitUntil: 'networkidle' });
    // Validación que a la url que vamos es la correcta
    await expect(page).toHaveURL(/buscarTrenEnlaces/);

    // Seleccionamos el primer presupuesto, comprobamos que el acordeon la tarifa básica esten visibles y hacemos click.
    await page.click('#tren_i_1');
    await expect(page.locator('#acordeon-cards_i_1')).toBeVisible();
    await expect(page.locator('#acordeon-cards_i_1 .tarifaBasica')).toBeVisible();
    await page.click('#acordeon-cards_i_1 .tarifaBasica');

    // Uso de AI (depende de que opción escoges salta el modal o no, tenia problemas ya que mi if mirando solamente si el modal-content era visible, me saltaba un error de que había <30)
    // if (await page.locator('.modal-content').isVisible()) {
    // await page.locator('[aria-hidden="true"]').click();
    //} 
    if (await page.locator('.modal-content:visible', { hasText: 'Aviso' }).count() > 0) { //Miramos si aparece un modal con el título Aviso
        await page.locator('.modal-content:visible', { hasText: 'Aviso' }).locator('button.close').click(); //Cerramos el modal
        await expect(page.locator('.modal-content:visible', { hasText: 'Aviso' })).toHaveCount(0, { timeout: 3000 }); //Le damos tiempo a que se cierre correctamente el modal
    }

    // Click en el botón de seleccionar del resumen.
    await page.click('#btnSeleccionar');

    // Click en el botón para aceptar que queremos seguir con la tarifa básica
    await page.click('#aceptarConfirmacionFareUpgrade');

    // Validación que a la url que vamos es la correcta
    await expect(page).toHaveURL(/datosViajeEnlaces/);

    // Guardamos el estado por si quisieramos automatizar a partir de aqui los detalles de los viajeros.
    await page.context().storageState({ path: 'renfe-state.json' });
});



// Falta que seleccione un tren con precio menor a 60€