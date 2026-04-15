import Foundation
import MusicKit

actor AppleMusicService {
    func requestAuthorization() async throws {
        let status = await MusicAuthorization.request()
        guard status == .authorized else {
            throw MusicServiceError.notAuthorized
        }
    }

    func fetchLibraryPlaylists(limit: Int = 25) async throws -> [PlaylistModel] {
        var request = MusicLibraryRequest<Playlist>()
        request.limit = limit

        let response = try await request.response()
        return response.items.map { playlist in
            PlaylistModel(
                id: playlist.id.rawValue,
                name: playlist.name,
                genreHints: Self.extractGenreHints(from: playlist.name)
            )
        }
    }

    func fetchRecommendations(from playlists: [PlaylistModel], limit: Int = 20) async throws -> [RecommendedTrack] {
        let genreTerms = Array(Set(playlists.flatMap { $0.genreHints })).prefix(3)
        let searchTerm = genreTerms.isEmpty ? "pop" : genreTerms.joined(separator: " ")

        var searchRequest = MusicCatalogSearchRequest(term: searchTerm, types: [Song.self])
        searchRequest.limit = limit

        let response = try await searchRequest.response()
        return response.songs.compactMap { song in
            RecommendedTrack(
                id: song.id.rawValue,
                title: song.title,
                artistName: song.artistName,
                previewURL: song.previewAssets?.first?.url
            )
        }
    }

    private static func extractGenreHints(from text: String) -> [String] {
        let knownGenres = ["pop", "hip-hop", "rap", "r&b", "rock", "country", "electronic", "dance", "jazz", "classical", "indie"]
        let lowercased = text.lowercased()

        return knownGenres.filter { lowercased.contains($0) }
    }
}

enum MusicServiceError: LocalizedError {
    case notAuthorized

    var errorDescription: String? {
        switch self {
        case .notAuthorized:
            return "Apple Music access is required to continue."
        }
    }
}
