import { test, expect } from '@playwright/test';

test.use({ storageState: 'renfe-state.json' });
test('Página Venta', async ({ page }) => {
    // Url para realizar las pruebas y la espera de que este todo bien cargado antes de empezar
    await page.goto('https://venta.renfe.com/vol/buscarTrenEnlaces.do', { waitUntil: 'networkidle' });
    // Validación que a la url que vamos es la correcta
    await expect(page).toHaveURL(/buscarTrenEnlaces/);

    // Seleccionamos el primer presupuesto, comprobamos que el acordeon la tarifa básica esten visibles y hacemos click.
    // He hecho pruebas con la AI (claude y chatgpt) para seleccionar un tren con precio menor a 60€, pero no he conseguido que me lo seleccione correctamente.
    // Mi idea era hacer un bucle que fuera iterando por todas las cards, conmprobar el precio y si este estaba dentro del rango, hacer click
    // al no haber cambiado el dia en el calendario, si se tira el test por la noche, no hay trenes y falla
    await page.locator('#tren_i_1').click();
    await expect(page.locator('#acordeon-cards_i_1')).toBeVisible();
    await expect(page.locator('#acordeon-cards_i_1 .tarifaBasica')).toBeVisible();
    await page.locator('#acordeon-cards_i_1 .tarifaBasica').click();

    
    /*
    const cards = page.locator('[id^="tren_i_"]');

    
    for (let i = 0; i < await cards.count(); i++) {
        const card = cards.nth(i);

        const priceText = await card.locator('.precio-final').innerText();
        const price = Number(priceText.replace('€', '').replace(',', '.').trim());

        if (price >= 50 && price <= 60) {
            await card.click(); // seleccionar la card
            await expect(card.locator('.tarifaBasica')).toBeVisible();
            await card.locator('.tarifaBasica').click(); // seleccionar tarifa
            break;
        }
    }
    */

    // Uso de AI (depende de que opción escoges salta el modal o no, tenia problemas ya que mi if mirando solamente si el modal-content era visible, me saltaba un error de que había <30)
    // if (await page.locator('.modal-content').isVisible()) {
    // await page.locator('[aria-hidden="true"]').click();
    //} 
    if (await page.locator('.modal-content:visible', { hasText: 'Aviso' }).count() > 0) { //Miramos si aparece un modal con el título Aviso
        await page.locator('.modal-content:visible', { hasText: 'Aviso' }).locator('button.close').click(); //Cerramos el modal
        await expect(page.locator('.modal-content:visible', { hasText: 'Aviso' })).toHaveCount(0, { timeout: 3000 }); //Le damos tiempo a que se cierre correctamente el modal
    }

    // Click en el botón de seleccionar del resumen. Con el locator, hay dos con el mismo id (que hacen referencia l mismo botón) y no funciona correctamente
    await page.click('#btnSeleccionar');

    // Click en el botón para aceptar que queremos seguir con la tarifa básica
    await page.locator('#aceptarConfirmacionFareUpgrade').click();

    // Validación que a la url que vamos es la correcta
    await expect(page).toHaveURL(/datosViajeEnlaces/);

    // Guardamos el estado por si quisieramos automatizar a partir de aqui los detalles de los viajeros.
    await page.context().storageState({ path: 'renfe-state.json' });
});



// Falta que seleccione un tren con precio menor a 60€