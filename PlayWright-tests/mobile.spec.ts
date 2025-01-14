import { test, expect } from '@playwright/test';

const routes = [
    '/',                
    '/addemployee',           
    '/admin-dashboard',         
    '/dbbackup',    
    '/login',      
    '/pay-rates',           
    '/payroll-management', 
    '/payslip',  
    '/register',  
    '/sinhala-payslip', 
    '/view-employees',

  ];


test.describe('Mobile Responsiveness - Dashboard', () => {
    const mobileDevices = [
        { name: 'iPhone 12', width: 390, height: 844 },
        { name: 'Pixel 5', width: 393, height: 851 },
        { name: 'Samsung Galaxy S21', width: 360, height: 800 },
    ];

    mobileDevices.forEach(device => {
        test(`should display dashboard correctly on ${device.name}`, async ({ page }) => {
            await page.setViewportSize({ width: device.width, height: device.height });
            await page.goto('http://localhost:3000/dashboard');

            // Add your assertions here
            const title = await page.title();
            expect(title).toBe('TSP Payroll APP');

            await page.waitForSelector('#mobile-menu-button');


            // Example: Check if a specific element is visible
            const element = await page.$('#mobile-menu-button');
            expect(element).not.toBeNull();
        });
    });
});

test.describe('Responsive Design - Check All Pages if any element causes to horizontal scroll', () => {
    for (const route of routes) {
        test(`should not have horizontal scrolling on ${route}`, async ({ page }) => {
            // Set a small screen size (e.g., 375px width for mobile devices)
            await page.setViewportSize({ width: 375, height: 667 });
        
             // Navigate to the route
      await page.goto(`http://localhost:3000${route}`);
        
            // Evaluate scrollWidth vs innerWidth
            const hasHorizontalScroll = await page.evaluate(() => {
              return document.documentElement.scrollWidth > window.innerWidth;
            });
        
             // Log or take a screenshot if there's a problem
      if (hasHorizontalScroll) {
        console.error(`Horizontal scrolling detected on ${route}`);
        await page.screenshot({ path: `scroll-fail-${route.replace(/\//g, '_')}.png` });
      }
          });
    }
   
  });

  test.describe('Responsive Design - Check All Pages if any element exceeds body container', () => {
    for (const route of routes) {
        test(`Elements should not exceed body container on ${route}`, async ({ page }) => {
            // Set a small screen size (e.g., 375px width for mobile devices)
            await page.setViewportSize({ width: 375, height: 667 });
        
             // Navigate to the route
      await page.goto(`http://localhost:3000${route}`);
        
           // Evaluate the body width
    const bodyRect = await page.evaluate(() => {
        const body = document.body;
        return body.getBoundingClientRect();
      });

       // Check all elements to see if any exceed the body width
    const overflowingElements = await page.evaluate(bodyRect => {
        const allElements = Array.from(document.querySelectorAll('*'));
        return allElements
          .filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.right > bodyRect.right || rect.left < bodyRect.left; // Exceeds body's width
          })
          .map(el => ({
            tag: el.tagName,
            outerHTML: el.outerHTML,
            rect: el.getBoundingClientRect(),
          })); // Return info about overflowing elements
      }, bodyRect);

       // Assert that there are no overflowing elements
    expect(overflowingElements.length).toBe(0);

    // Log any overflowing elements for debugging
    if (overflowingElements.length > 0) {
      console.error(`Overflowing Elements in ${route}:`, overflowingElements);
    }
        
             
     
          });
    }
   
  });


