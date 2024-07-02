import { Component } from "@angular/core";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [],
  template: `
    <main>
      <header>
        <nav>
          <ul class="flex-row" role="list">
            <li><a href="#" class="nav-link">One</a></li>
            <li><a href="#" class="nav-link">Two</a></li>
            <li><a href="#" class="nav-link">Three</a></li>
            <li><a href="#" class="nav-link">Four</a></li>
          </ul>
        </nav>
      </header>
    </main>
  `,
  styles: `
    .flex-row {
      display: flex;
      justify-content: space-between;
      padding-left: 0;
      flex-shrink: 0;
    }

    .nav-link {
      text-decoration: none;
      color: black;
    }
  `,
})
export class HomeComponent {}
