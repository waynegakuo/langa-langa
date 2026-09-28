import { Driver } from '../../core/models/openf1.models';
import {
  getTeamAssetSlug,
  getTeamCarAssetPath,
  getTeamLogoAssetPath,
} from '../constants/f1-team-assets.constants';
import { TeamCarouselEntry } from '../models/team-carousel.model';

export function buildTeamCarouselEntries(drivers: Driver[]): TeamCarouselEntry[] {
  const teams = new Map<string, TeamCarouselEntry>();

  for (const driver of drivers) {
    if (!teams.has(driver.team_name)) {
      const slug = getTeamAssetSlug(driver.team_name);
      teams.set(driver.team_name, {
        teamName: driver.team_name,
        teamColour: driver.team_colour,
        logoUrl: slug ? getTeamLogoAssetPath(slug) : null,
        carImageUrl: slug ? getTeamCarAssetPath(slug) : null,
        drivers: [],
      });
    }

    teams.get(driver.team_name)!.drivers.push(driver.name_acronym);
  }

  return [...teams.values()]
    .map((team) => ({
      ...team,
      drivers: [...team.drivers].sort(),
    }))
    .sort((a, b) => a.teamName.localeCompare(b.teamName));
}
